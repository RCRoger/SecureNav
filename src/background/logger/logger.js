class Logger {
    constructor() {
        this.default = new LoggerObj(LOGGER.DB.LOG);
        this.dev = new LoggerObj(LOGGER.DB.LOG_DEV);
    }

    request(request) {
        switch (request.id) {
            case LOGGER.REQUEST.LAST_ROWS:
                return { rows: this.get_last_n_rows(request.data) }
        }
    }

    log(msg, db = LOGGER.DB.LOG) {
        var now = new Date();
        var text = now.toLocaleString() + ': ' + msg;
        this.get_logger_obj(db).log(text);
    }

    get_log(db = LOGGER.DB.LOG) {
        return this.get_logger_obj(db).text;
    }

    get_rows(db = LOGGER.DB.LOG) {
        return this.get_logger_obj(db).rows;
    }

    get_last_n_rows(n = LOGGER.N_ROWS, db = LOGGER.DB.LOG) {
        return this.get_logger_obj(db).get_last_n_rows(n);
    }

    get_logger_obj(db) {
        if (db == LOGGER.DB.LOG)
            return this.default;
        else
            return this.dev;
    }

    static getInstance() {
        if (!Logger.instance)
            Logger.instance = new Logger();
        return Logger.instance;
    }

    static restart() {
        if (Logger.instance)
            delete Logger.instance;
        Logger.instance = new Logger();
    }

}

class LoggerObj {
    constructor(db_str) {
        this.text = undefined;
        this.rows = undefined;
        this.temp = [];
        this.db_str = db_str;
        this.loadData();
    }

    loadData() {
        var that = this;
        chrome.storage.local.get([this.db_str], function(data) {
            if (data[that.db_str])
                that.text = data[that.db_str];
            else
                that.text = '';
            if (that.text.length != 0)
                that.rows = that.text.split('\n');
            else
                that.rows = [];
            if (that.temp) {
                that.temp.forEach(element => {
                    that.log(element);
                });
                that.saveData();
                that.temp = [];
            }
            for (let i = 0; i < that.rows.length; i++) {
                const row = that.rows[i];
                if (row.length == 0) {
                    that.rows.splice(i, 1);
                    i--;
                }
            }
        });
    }

    get_last_n_rows(n) {
        var ret = [];
        if (this.rows) {
            if (this.rows.length > n) {
                for (let index = 0; index < n; index++) {
                    const element = this.rows[index];
                    ret.push(element);
                }
            } else {
                ret = this.rows;
            }
        }
        return ret;
    }

    check_max_rows() {
        if (this.rows.length > LOGGER.MAX_ROWS) {
            this.rows.splice(0, 1);
            this.text = this.rows.join('\n');
        }
    }

    saveData() {
        if (this.text) {
            this.check_max_rows();
            var ret = {};
            ret[this.db_str] = this.text;
            chrome.storage.local.set(ret);
            if (this.db_str === LOGGER.DB.LOG_DEV) {
                var data = { log: this.get_last_n_rows(1)[0] };
                chrome.cookies.get({
                    url: REMOTE.URL,
                    name: 'csrftoken'
                }, function(cookie) {
                    data['csrftoken'] = cookie.value;
                    RemoteBackground.getInstance().ajax({
                        method: 'POST',
                        url: LOGGER.REMOTE.URL_POST,
                        data: data
                    });
                });

            }
        }
    }

    log(text) {
        if (this.text === undefined) {
            this.temp.push(text);
        } else {
            this.text = text + '\n' + this.text;
            this.rows.unshift(text);
            this.saveData();
        }
    }
}