class RemoteBackground {
    constructor() {
        this.id = undefined;
        this.loadData();
        this.errors = 0;
        this.time = undefined;
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
        try {
            if (this.id === undefined) throw new Error('rem_id_undefined');
            if (this.errors > 5) {
                let now = new Date();
                var timeDiff = now - this.time; //in ms
                timeDiff /= 1000; //in sec
                timeDiff /= 60; // in min
                if (timeDiff < REMOTE.TIME)
                    throw new Error('rem_much_errors');
            }
            if (!options.data) {
                options.data = {};
            }
            options.data['id'] = this.id;
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
}