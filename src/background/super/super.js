class SuperBackground {
    constructor() {
        this.enabled = undefined;
        this.logged = undefined;
        this.hash = undefined;
        this.time = undefined;
        this.loadData();
    }

    request_filter(request, callback) {
        const edit_rgx = /(add|remove|set|dev|import)/;
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
        if (!this.enabled) return false;
        if (!new_psw || new_psw.length == 0) {
            PopUpController.show_error('invalid_format');
            Logger.getInstance().log('invalid_format', LOGGER.DB.LOG_DEV);
        } else if (this.match(old_psw) || !this.hash) {
            this.hash = CryptoJS.MD5(new_psw).toString();
            this.logged = true;
            this.saveData();
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
        return { logged: this.is_logged(), enabled: this.enabled };
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