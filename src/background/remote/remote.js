class RemoteBackground {
    constructor() {
        this.id = undefined;
        this.loadData();
    }

    loadData() {
        var that = this;
        chrome.storage.local.get(REMOTE.DB.ID, function(data) {
            that.id = data[REMOTE.DB.ID];
            if (that.id === undefined) {
                that.get_remote_id();
            }
        })
    }

    saveData() {
        var ret = {};
        ret[REMOTE.DB.ID] = this.id;
        chrome.storage.local.set(ret);
    }

    get_remote_id() {
        var that = this;
        $.ajax({
            method: 'GET',
            url: REMOTE.URL + 'get_id'
        }).done(function(data) {
            var d = data;
            if (d.id) {
                that.id = d.id;
                that.saveData();
            }
        });
    }

    ajax(options) {
        if (this.id === undefined) throw new Error('rem_id_undefined');
        if (!options.data) {
            options.data = {};
        }
        options.data['id'] = this.id;
        return $.ajax(options);
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
}