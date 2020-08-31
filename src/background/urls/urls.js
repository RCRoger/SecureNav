class UrlBackground {
    constructor(db) {
        this.urls = undefined;
        this.enabled = undefined;
        this.type = undefined;
        this.dB = db;
    }

    request(request) {
        switch (request.id) {
            case this.dB.REQUEST.URL_SET_TYPE:
                this.setType(request.data);
                break;
            case this.dB.REQUEST.URL_SET_ENABLED:
                this.setEnabled(request.data);
                break;
            case this.dB.REQUEST.URL_ADD_URLS:
                this.add_urls(request.data.data, request.data.reset);
                break;
            case this.dB.REQUEST.URL_REMOVE_URLS:
                this.remove_urls(request.data.data);
                break;
            case this.dB.REQUEST.URL_GET_DATA:
                return this.getData(request.data);
            case this.dB.REQUEST.ADD_URL:
                this.add_url_from_str(request.data);
                return this.getData(request.data);
            case this.dB.REQUEST.URL_SET_ENABLED_LITE:
                this.setEnabled(request.data);
                return this.getData(request.data);
            default:
                Logger.getInstance().log('invalid_format' + ' ' + request.id, LOGGER.DB.LOG_DEV);
                PopUpController.show_error('invalid_format');
                return;
        }
        return { urls: this };
    }

    edit_url(data) {
        if (!data.index || data.index > this.urls.length || data.index) {
            Logger.getInstance().log('invalid_format', LOGGER.DB.LOG_DEV);
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

    loadData(data) {
        this.urls = [];
        this.urls_regex = [];
        this.enabled = data[this.dB.DB.URL_ENABLED];
        this.type = data[this.dB.DB.URL_TYPE];
        data[this.dB.DB.URL_LIST].forEach(item => {
            this.urls.push(item);
            this.urls_regex.push(url_regex(item));
        });
    }

    saveData() {
        chrome.storage.local.set(db_url_item(this.dB, this.enabled, this.type, this.urls));
    }

    add_urls(data, reset = false) {
        if (reset) {
            this.urls = [];
            this.url_regex = [];
        }
        data.forEach(item => {
            this.add_url(item.protocol, item.host, item.page);
        });
        this.saveData();
    }

    add_url(protocol, host, page) {
        var item = url_item(host, protocol, page);
        if (!this.contains_url_str(item.str) && is_pattern_valid_item(item)) {
            this.urls.push(item);
            this.urls_regex.push(url_regex(item));
        }
    }

    add_url_from_str(data) {
        var item = get_item_from_str(data.url);
        if (is_pattern_valid_item(item)) {
            this.add_url(item.protocol, item.host, item.page);
        } else {
            Logger.getInstance().log('invalid_pattern' + ' ' + item.str, LOGGER.DB.LOG_DEV);
            PopUpController.show_error('invalid_pattern' + ' ' + item.str);
        }
        this.saveData();
    }



    remove_urls(urls) {
        var corrector = 0;
        urls.forEach(index => {
            this.urls.splice(index - corrector, 1);
            this.urls_regex.splice(index - corrector, 1);
            corrector++;
        });
        this.saveData();
    }

    getData(data) {
        return { hasBlock: this.needBlock(data), type: this.type, enabled: this.enabled, url: data.url };
    }

    setType(type) {
        if (type != 0 && type != 1) {
            Logger.getInstance().log('invalid_format', LOGGER.DB.LOG_DEV);
            PopUpController.show_error('invalid_format');
            return;
        }
        this.type = type;
        this.saveData();
    }

    setEnabled(enabled) {
        if (enabled !== true && enabled !== false) {
            Logger.getInstance().log('invalid_format', LOGGER.DB.LOG_DEV);
            PopUpController.show_error('invalid_format');
            return;
        }
        this.enabled = enabled;
        this.saveData();
    }

    import_json(data, override) {
        try {
            var json = JSON.parse(data);
            this.import_enabled_json(json);
            this.import_type_json(json);
            this.import_urls_json(json, override);
        } catch (e) {
            Logger.getInstance().log('invalid_format', LOGGER.DB.LOG_DEV);
            PopUpController.show_error(e.message);
        }
    }

    import_enabled_json(json) {
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

    import_type_json(json) {
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

    import_urls_json(json, override) {
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

    import_urls_csv(data, override) {
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
            Logger.getInstance().log('invalid_format', LOGGER.DB.LOG_DEV);
            PopUpController.show_error(e.message);
        }
    }

    import_urls_txt(data, override) {
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
            Logger.getInstance().log('invalid_format', LOGGER.DB.LOG_DEV);
            PopUpController.show_error(e.message);
        }
    }

    contains_url_str(url) {
        if (Array.isArray(this.urls_regex) && this.urls_regex.length) {
            return this.urls_regex.some(function(item) {
                if (item.exec(url))
                    return true;
            });
        }
        return false;
    }

}