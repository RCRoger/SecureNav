function UrlList(db) {
    this.urls = undefined;
    this.enabled = undefined;
    this.type = undefined;
    this.db = db;
}

(function(UL, undefined) {
    UL.prototype.edit_url = function(data) {
        if (!data.index || data.index > this.urls.length || data.index) {
            Logger.getInstance().log('invalid_format');
            PopUpController.show_error('invalid_format');
            return;
        }

        if (data.protocol) {
            this.urls[data.index].protocol = data.protocol;
        }

        if (data.host) {
            this.urls[data.index].host = data.host;
        }

        if (data.page) {
            this.urls[data.index].page = data.page;
        }

        this.saveData();
    }

    UL.prototype.loadData = function(data) {
        this.urls = [];
        this.urls_regex = [];
        this.enabled = data[this.db.DB.URL_ENABLED];
        this.type = data[this.db.DB.URL_TYPE];
        data[this.db.DB.URL_LIST].forEach(item => {
            this.urls.push(item);
            this.urls_regex.push(url_regex(item));
        });
    }

    UL.prototype.saveData = function() {
        chrome.storage.local.set(db_url_item(this.db, this.enabled, this.type, this.urls));
    }

    UL.prototype.add_urls = function(data, reset = false) {
        if (reset)
            this.urls = [];
        data.forEach(item => {
            this.add_url(item.protocol, item.host, item.page);
        });
        this.saveData();
    }

    UL.prototype.add_url = function(protocol, host, page) {
        var item = url_item(host, protocol, page);
        var includes = this.urls.includes(item);
        if (!includes) {
            this.urls.push(item);
            this.urls_regex.push(url_regex(item));
        }
    }

    UL.prototype.add_url_from_str = function(data) {
        var item = get_item_from_str(data.url);
        this.add_url(item.protocol, item.host, item.page);
        this.saveData();
    }



    UL.prototype.remove_urls = function(urls) {
        var corrector = 0;
        urls.forEach(index => {
            this.urls.splice(index - corrector, 1);
            this.urls_regex.splice(index - corrector, 1);
            corrector++;
        });
        this.saveData();
    }

    UL.prototype.getData = function(data) {
        return { hasBlock: this.needBlock(data), type: this.type, enabled: this.enabled, url: data.url };
    }

    UL.prototype.setType = function(type) {
        if (type != 0 && type != 1) {
            Logger.getInstance().log('invalid_format');
            PopUpController.show_error('invalid_format');
            return;
        }
        this.type = type;
        this.saveData();
    }

    UL.prototype.setEnabled = function(enabled) {
        if (enabled !== true && enabled !== false) {
            Logger.getInstance().log('invalid_format');
            PopUpController.show_error('invalid_format');
            return;
        }
        this.enabled = enabled;
        this.saveData();
    }

    UL.prototype.import_json = function(data, override) {
        try {
            var json = JSON.parse(data);
            this.import_enabled_json(json);
            this.import_type_json(json);
            this.import_urls_json(json, override);
        } catch (e) {
            PopUpController.show_error(e.message);
        }
    }

    UL.prototype.import_enabled_json = function(json) {
        var status = 'OK';

        var enabled = json[this.dB.DB.URL_ENABLED];
        if (enabled !== undefined) {
            if (enabled === true || enabled === false) {
                this.enabled = enabled;
            } else {
                status = 'invalid_format';
                throw new Error(status);
            }
        }
    }

    UL.prototype.import_type_json = function(json) {
        var status = 'OK';

        var type = json[this.dB.DB.URL_TYPE];
        if (type !== undefined) {
            if (type === 0 || type === 1) {
                this.type = type;
            } else {
                status = 'invalid_format';
                throw new Error(status);
            }
        }
    }

    UL.prototype.import_urls_json = function(json, override) {
        var status = 'OK';
        var rows = [];
        var list = json[this.dB.DB.URL_LIST];
        if (list !== undefined) {
            if (!Array.isArray(list)) {
                status = 'invalid_format';
                throw new Error(status);
            }

            list.forEach(item => {

                var scheme = item['protocol'];
                var host = item['host'];
                var page = item['page'];
                var str = item['str']
                if (scheme === undefined || host === undefined || page === undefined || str === undefined) {
                    status = 'invalid_format';
                } else if (!is_scheme_valid(scheme) || !is_host_valid(host)) {
                    status = 'invalid_pattern'
                }
                if (status != 'OK') {
                    rows.splice(0, rows.length);
                    throw new Error(status);
                }
                rows.push(item);
            });
            this.add_urls(rows, override);
        }
    }

    UL.prototype.import_urls_csv = function(data, override) {
        try {
            var rows = [];
            var csv = data.split(/(\,|\;)/);
            if (csv.length > 0) {
                csv.forEach(url => {
                    if (url.length == 0) return;
                    var item = get_item_from_str(url);
                    if (!is_scheme_valid(item.protocol) || !is_host_valid(item.host)) {
                        rows.splice(0, rows.length);
                        throw new Error('invalid_pattern');
                    }
                    rows.push(item);
                });
                this.add_urls(rows, override);
            } else {
                throw new Error('invalid_format');
            }
        } catch (e) {
            PopUpController.show_error(e.message);
        }
    }

    UL.prototype.import_urls_txt = function(data, override) {
        try {
            var rows = [];
            var txt = data.split('\n');
            if (txt.length > 0) {
                txt.forEach(url => {
                    if (url.length == 0) return;
                    var item = get_item_from_str(url);
                    if (!is_scheme_valid(item.protocol) || !is_host_valid(item.host)) {
                        rows.splice(0, rows.length);
                        throw new Error('invalid_pattern');
                    }
                    rows.push(item);
                });
                this.add_urls(rows, override);
            } else {
                throw new Error('invalid_format');
            }
        } catch (e) {
            PopUpController.show_error(e.message);
        }
    }

})(DownloadUrlList);