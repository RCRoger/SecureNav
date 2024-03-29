class SuperBackground {
    constructor() {
        this.enabled = undefined;
        this.logged = undefined;
        this.hash = undefined;
        this.time = undefined;
        this.loadData();
    }

    request_filter(request, callback) {
        const edit_rgx = /(add|remove|set|dev|import|rem_id)/;
        if (!this.enabled || this.is_logged() || !edit_rgx.exec(request.id)) {
            return callback.request(request);
        }
        PopUpController.show_error('sp_not_logged');
        Logger.getInstance().log('sp_not_logged', LOGGER.DB.LOG_DEV);
        return callback.getData();
    }

    request(request) {
        switch (request.id) {
            case SUPER.REQUEST.LOGIN:
                this.login(request.data);
                break;
            case SUPER.REQUEST.LOGOUT:
                this.logout();
                break;
            case SUPER.REQUEST.CHANGE_PSW:
                this.change(request.data.old, request.data.new);
                break;
            case SUPER.REQUEST.SET_ENABLED:
                this.setEnabled(request.data);
                break;
            default:
                break;
        }
        return this.getData();
    }

    match(psw) {
        return CryptoJS.MD5(psw).toString() === this.hash;
    }

    login(psw) {
        if (!this.enabled || !this.hash) return false;
        if (this.match(psw)) {
            this.logged = true;
            this.time = new Date();
        } else {
            this.time = undefined;
            this.logged = false;
        }
        return this.logged;
    }

    logout() {
        if (!this.enabled) return false;
        this.time = undefined;
        this.logged = false;
    }

    change(old_psw, new_psw) {
        let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[^a-zA-Z1-9])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}/;
        if (!reg.exec(new_psw)) {
            PopUpController.show_error('sp_pwd_invalid');
        } else if (!new_psw || new_psw.length == 0) {
            PopUpController.show_error('invalid_format');
            Logger.getInstance().log('invalid_format', LOGGER.DB.LOG_DEV);
        } else if (this.match(old_psw) || !this.hash && new_psw.length > 0) {
            this.hash = CryptoJS.MD5(new_psw).toString();
            this.logged = true;
            this.saveData();
            PopUpController.show_info('sp_changed');
            return true;
        }
        return false;
    }

    loadData() {
        var that = this;
        chrome.storage.local.get(get_dict_values(SUPER.DB), function(data) {
            that.enabled = data[SUPER.DB.ENABLED];
            that.hash = data[SUPER.DB.PSW];

        });
    }

    saveData() {
        chrome.storage.local.set(super_item(this.enabled, this.hash));
    }

    getData() {
        return { logged: this.is_logged(), enabled: this.enabled, hasHash: this.hash !== undefined };
    }

    import (data, override) {
        if (override) {
            if (data[SUPER.DB.PSW]) {
                this.hash = data[SUPER.DB.PSW];
            }
            if (data[SUPER.DB.ENABLED])
                this.setEnabled(data[SUPER.DB.ENABLED]);
        } else {
            if (this.hash === undefined) {
                this.hash = data[SUPER.DB.PSW];
            }
            if (this.enabled === undefined) {
                this.enabled = data[SUPER.DB.ENABLED];
            }
        }
    }

    is_logged() {
        if (!this.enabled) return false;
        if (this.logged) {
            let now = new Date();
            var timeDiff = now - this.time; //in ms
            timeDiff /= 1000; //in sec
            timeDiff /= 60; // in min
            if (timeDiff > SUPER.MAX_TIME) this.logged = false;
            return this.logged;
        }
        return false;
    }

    setEnabled(data) {
        if (data !== true && data !== false) {
            Logger.getInstance().log('invalid_format', LOGGER.DB.LOG_DEV);
            PopUpController.show_error('invalid_format');
            return;
        } else if (this.hash === undefined) {
            Logger.getInstance().log('sp_not_hash', LOGGER.DB.LOG_DEV);
            PopUpController.show_error('sp_not_hash');
            return;
        }
        if (data == false) {
            this.logout();
        }
        this.enabled = data;
        this.saveData();
    }

    static restart() {
        if (SuperBackground.instance)
            delete SuperBackground.instance;
        SuperBackground.instance = new SuperBackground();;
    }

    static getInstance() {
        if (!SuperBackground.instance)
            SuperBackground.instance = new SuperBackground();
        return SuperBackground.instance;
    }
}