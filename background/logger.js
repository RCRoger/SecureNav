class Logger {
    constructor() {
        this.default = new LoggerObj(LOGGER.DB.LOG);
        this.dev = new LoggerObj(LOGGER.DB.LOG_DEV);
    }

    log(msg, db = LOGGER.DB.LOG) {
        var now = new Date.now();
        var text = now.toISOString() + ': ' + msg;
        this.get_logger_obj(db).log(text);
    }

    get_log(db = LOGGER.DB.LOG) {
        return this.get_logger_obj(db).text;
    }

    get_rows(db = LOGGER.DB.LOG) {
        return this.get_logger_obj(db).rows;
    }

    get_last_n_rows(n, db = LOGGER.DB.LOG){
        return this.get_logger_obj(db).get_last_n_rows(n);
    }

    get_logger_obj(db) {
        if (db == LOGGER.DB.LOG)
            return this.default;
        else
            return this.dev;
    }

}

class LoggerObj {
    constructor(db_str) {
        this.text = undefined;
        this.rows = undefined;
        this.temp = undefined;
        this.db_str = db_str;
        this.loadData();
    }

    loadData() {
        chrome.storage.local.get([this.db_str], function (data) {
            this.text = data[this.db_str];
            this.rows = this.text.split('\n');
            if (this.temp) {
                this.log(this.temp);
                this.saveData();
                this.temp = undefined;
            }
        });
    }

    get_last_n_rows(n) {
        var ret = [];
        if (this.rows) {
            if (this.rows.length > n) {
                for (let index = this.rows.length - 1; index > this.rows.length - 1 - n; index--) {
                    const element = this.rows[index];
                    ret.push(element);
                }
            }
            else {
                ret = this.rows;
            }
        }
        return ret;
    }

    saveData() {
        if (this.text) {
            var ret = {};
            ret[this.db_str] = this.text;
            chrome.storage.set(ret);
        }
    }

    log(text) {
        if (this.text = undefined) {
            this.temp = text;
        }
        else {
            this.text += '\n' + text;
            this.rows.push(text);
            this.saveData();
        }
    }


}

