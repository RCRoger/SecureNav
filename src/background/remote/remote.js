class RemoteBackground {
    constructor() {
        this.id = undefined;
        this.loadData();
        this.errors = 0;
        this.time = undefined;
        this.connected = undefined;
    }

    request(request) {
        switch (request.id) {
            case REMOTE.REQUEST.ID:
                PopUpController.show_info(this.id);
                break;
        }
    }

    loadData() {
        var that = this;
        chrome.storage.local.get(REMOTE.DB.ID, function(data) {
            that.id = data[REMOTE.DB.ID];
            if (that.id === undefined && !RemoteBackground.requested) {
                RemoteBackground.requested = true;
                that.get_remote_id();
            } else if (that.id !== undefined) {
                that.check_connection();
            }
        });
    }

    saveData() {
        var ret = {};
        ret[REMOTE.DB.ID] = this.id;
        chrome.storage.local.set(ret);
    }

    check_connection() {
        $.ajax({
            method: 'GET',
            url: REMOTE.URL,
            complete: onComplete
        });
    }

    get_remote_id() {
        $.ajax({
            method: 'GET',
            url: REMOTE.URL + 'get_id',
            success: function(data) {
                var that = RemoteBackground.getInstance();
                var d = data;
                if (d.id) {
                    that.id = d.id;
                    that.saveData();
                }
                RemoteBackground.requested = false;
                that.connected = true;
                Import.import_data_remote();
            }
        });
    }

    need_data() {
        this.ajax({
            method: "GET",
            url: EXPORT.REMOTE.URL_LOAD,
            success: function(data) {
                if (data.need_data) {
                    Export.export_items_remote();
                }
                if (data.need_import) {
                    Import.import_data_remote();
                }
            }
        });
    }

    ajax(options) {
        try {
            if (!this.connected) {
                return null;
            }
            if (this.id === undefined) throw new Error('rem_id_undefined');
            if (!options.data) {
                options.data = {};
            }
            options.data['id'] = this.id;
            if (!options.complete) {
                options.complete = onComplete;
            }
            var ret = $.ajax(options);
            this.errors = 0;
            this.time = undefined;
            return ret
        } catch (e) {
            this.errors++;
            this.time = new Date();
        }
        return null;
    }

    static getInstance() {
        if (!RemoteBackground.instance)
            RemoteBackground.instance = new RemoteBackground();
        return RemoteBackground.instance;
    }

    static restart() {
        if (RemoteBackground.instance)
            delete RemoteBackground.instance;
        return RemoteBackground.instance = new RemoteBackground();
    }

    static requested = false;
}


function onComplete(data) {
    var that = RemoteBackground.getInstance();
    if (data.statusText === 'error' || data.statusText.startsWith('NetworkError')) {
        if (that.connected === undefined || that.connected === true) {
            Logger.getInstance().log('not_connected', LOGGER.DB.LOG_DEV);
            PopUpController.show_error('not_connected', { new_tab: true });
            PopUpController.show_badge_text('!');
            PopUpController.set_badge_title(chrome.i18n.getMessage('no_connected_title'));
        }
        that.connected = false;
        setTimeout(that.check_connection, 10000);
    } else {
        if (that.connected === undefined) {
            that.connected = true;
            that.need_data();
        }
        that.connected = true;
        PopUpController.show_badge_text('');
        PopUpController.set_badge_title();
    }
}