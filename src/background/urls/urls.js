class UrlBackground {
    constructor(db) {
        this.urls = undefined;
        this.urls_remote = [];
        this.urls_session = [];
        this.urls_block = [];
        this.urls_filters = [];
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
            case this.dB.REQUEST.URL_ASK_QUESTION:
                this.responsed(request.data.url, request.data.action);
                break;
            case this.dB.REQUEST.URL_SET_FILTERS:
                this.set_filters(request.data);
                break;
            default:
                Logger.getInstance().log('invalid_format' + ' ' + request.id, LOGGER.DB.LOG_DEV);
                PopUpController.show_error('invalid_format');
                return;
        }
        return { urls: this };
    }

    set_filters(data) {
        let index = this.urls_filters.indexOf(data);
        if (index == -1) {
            this.urls_filters.push(data);
        } else {
            this.urls_filters.splice(index, 1);
        }
        this.saveData();
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
        if (data[this.dB.DB.URL_LIST]) {
            data[this.dB.DB.URL_LIST].forEach(item => {
                this.urls.push(item);
                this.urls_regex.push(url_regex(item));
            });
        }
        if (data[this.dB.DB.URL_FILTERS]) {
            this.urls_filters = data[this.dB.DB.URL_FILTERS];
        }
    }

    saveData() {
        chrome.storage.local.set(db_url_item(this.dB, this.enabled, this.type, this.urls, this.urls_filters));
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
        return { hasBlock: this.needBlock(data), type: this.type, enabled: this.enabled, url: data.url, filters: this.urls_filters };
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
            Logger.getInstance().log(e.stack, LOGGER.DB.LOG_DEV);
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
                if (scheme === undefined || host === undefined || page === undefined) {
                    status = 'invalid_format';
                } else if (!is_scheme_valid(scheme) || !is_host_valid(host)) {
                    status = 'invalid_pattern'
                }
                if (status != 'OK') {
                    rows.splice(0, rows.length);
                    throw new Error(status);
                }
                rows.push(url_item(host, scheme, page));
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
            Logger.getInstance().log(e.stack, LOGGER.DB.LOG_DEV);
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
            Logger.getInstance().log(e.stack, LOGGER.DB.LOG_DEV);
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

    getRemote(item) {
        var item_lite = { protocol: item.protocol, host: item.host };
        if (this.urls_filters) {
            for (let i = 0; i < this.urls_filters.length; i++) {
                const element = this.urls_filters[i];
                item_lite['filter' + i] = element;
            }
        }
        var response = RemoteBackground.getInstance().ajax({
            type: "GET",
            url: this.dB.REMOTE.URL,
            data: item_lite,
            async: false
        });
        if (response !== null)
            return JSON.parse(response.responseText);
        return null;
    }

    responsed(url, action) {
        var index = this.urls_remote.indexOf(url.host);
        if (index != -1)
            this.urls_remote.splice(index, 1);
        if (action == REMOTE.ACTION.block) {
            this.urls_block.push(url.host);
            Logger.getInstance().log(this.dB.ALIAS + '_block notification_' + this.dB.ALIAS + '_blocked ' + url_item.str);
        } else if (action == REMOTE.ACTION.nothing) {
            this.urls_session.push(url.host);
        }
    }

    needBlock(url_item) {
        if (this.urls_session.includes(url_item.host)) {
            return false;
        } else if (this.urls_block.includes(url_item.host)) {
            return true;
        } else if (!this.urls_remote.includes(url_item.host)) {
            try {
                var item = this.getRemote(url_item);
                if (!item) {
                    return false;
                }
                if (item.length > 0)
                    item = item[0];

                if (item.action === REMOTE.ACTION.ask) {
                    PopUpController.show_ask({ data: this.dB.ALIAS + '_pending ' + item.description, req: this.dB.REQUEST.URL_ASK_QUESTION, url: url_item.str, host: url_item });
                    return true;
                } else if (item.action === REMOTE.ACTION.block) {
                    this.urls_block.push(url_item.host);
                    Logger.getInstance().log(this.dB.ALIAS + '_block ' + item.description + ' ' + url_item.str);
                    return true;
                }
                this.urls_remote.push(url_item.host);
            } catch (e) {
                Logger.getInstance().log(e.stack, LOGGER.DB.LOG_DEV);
            }
        }
        return false;
    }
}