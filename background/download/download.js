function DownloadBackground() {
    this.urls = new DownloadUrlList();
    this.max_size = new DownloadMaxSize();
    this.show_info = undefined;
    this.checks = 0;
    this.blocks = 0;
    this.loadData(true);
}

(function(DB, undefined) {

    DB.prototype.request = function(request) {
        switch (request.id) {
            case DOWNLOAD.REQUEST.GET_DATA:
                return this.get_data();
            case DOWNLOAD.REQUEST.URL_SET_TYPE:
                this.urls.setType(request.data);
                break;
            case DOWNLOAD.REQUEST.URL_SET_ENABLED:
                this.urls.setEnabled(request.data);
                break;
            case DOWNLOAD.REQUEST.URL_ADD_URLS:
                this.urls.add_urls(request.data.data, request.data.reset);
                break;
            case DOWNLOAD.REQUEST.URL_REMOVE_URLS:
                this.urls.remove_urls(request.data.data);
                break;
            case DOWNLOAD.REQUEST.SIZE_SET_ENABLED:
                this.max_size.setEnabled(request.data);
                break;
            case DOWNLOAD.REQUEST.SIZE_SET_VAL:
                this.max_size.setMaxSize(request.data);
                break;
            case DOWNLOAD.REQUEST.URL_GET_DATA:
                return this.urls.getData(request.data);
            case DOWNLOAD.REQUEST.ADD_URL:
                this.urls.add_url_from_str(request.data);
                return this.urls.getData(request.data);
            case DOWNLOAD.REQUEST.URL_SET_ENABLED_LITE:
                this.urls.setEnabled(request.data);
                return this.urls.getData(request.data);
            case DOWNLOAD.REQUEST.SET_SHOW_INFO:
                this.setShowInfo(request.data);
                break;
            case DOWNLOAD.REQUEST.EXPORT:
                Export.export_items(get_dict_values(DOWNLOAD.DB), 'dwl_data');
                return;
            case DOWNLOAD.REQUEST.IMPORT:
                this.import(request.data.data, request.data.file, request.data.override);
                return;
        }
        return this.get_data();
    }

    DB.prototype.get_data = function() {
        return this;
    }

    DB.prototype.import = function(data, file, override) {
        switch (get_file_extension(file.name)) {
            case 'json':
                this.urls.import_json(data, override);
                this.max_size.import_json(data);
                break;
            case 'csv':
                this.urls.import_urls_csv(data, override);
                break;
            case 'txt':
                this.urls.import_urls_txt(data, override);
                break;
            default:
                Logger.getInstance().log('invalid_format');
                PopUpController.show_error('invalid_format');
                break;
        }
    }

    DB.prototype.setShowInfo = function(data) {
        if (data !== true && data !== false) {
            Logger.getInstance().log('invalid_format');
            PopUpController.show_error('invalid_format');
            return;
        }
        this.show_info = data;
        this.saveDataLite();
    }

    DB.prototype.block_action = function(file) {
        chrome.downloads.pause(file.id);
        let logger = Logger.getInstance();
        logger.log('dwl_paused', LOGGER.DB.LOG_DEV);
        this.checks++;
        var need_block = false;
        let status = '';
        if (this.urls.needBlock(file)) {
            need_block = true;
            status = 'url_block';
        } else if (this.max_size.needBlock(file)) {
            chrome.downloads.cancel(file.id);
            need_block = true;
            status = 'size_block';
        }
        if (need_block) {
            chrome.downloads.cancel(file.id);
            this.blocks++;
            logger.log('dwl_cancel ' + status, LOGGER.DB.LOG_DEV);
            logger.log('dwl_cancel ' + status);
            if (this.show_info)
                PopUpController.show_info('dwl_cancel ' + status);

        } else {
            chrome.downloads.resume(file.id);

            logger.log('dwl_resume', LOGGER.DB.LOG_DEV);
        }

        this.saveDataLite();

    }

    DB.prototype.add_listener = function() {
        chrome.downloads.onCreated.removeListener(dwl_listener);
        chrome.downloads.onCreated.addListener(dwl_listener);
    }

    DB.prototype.loadData = function(first = undefined) {
        var that = this;
        var params = [
            DOWNLOAD.DB.URL_ENABLED,
            DOWNLOAD.DB.URL_TYPE,
            DOWNLOAD.DB.URL_LIST,
            DOWNLOAD.DB.SIZE_ENABLED,
            DOWNLOAD.DB.MAX_SIZE,
            DOWNLOAD.DB.SHOW_INFO,
            DOWNLOAD.DB.BLOCKS,
            DOWNLOAD.DB.CHECKS
        ];
        chrome.storage.local.get(params, function(data) {
            that.urls.loadData(data);
            that.max_size.loadData(data);
            that.show_info = data.dwl_show_info;
            that.checks = data[DOWNLOAD.DB.CHECKS];
            that.blocks = data[DOWNLOAD.DB.BLOCKS];

            if (first)
                that.add_listener();
        });
    }

    DB.prototype.saveDataLite = function() {
        chrome.storage.local.set(download_item_lite(this.show_info, this.blocks, this.checks));
    }

    DB.restart = function() {
        if (DB.instance)
            delete DB.instance;
        DB.instance = new DB();
    }

    DB.getInstance = function() {
        if (!DB.instance)
            DB.instance = new DB();
        return DB.instance;
    }

})(DownloadBackground);

function DownloadUrlList() {
    this.urls = undefined;
    this.urls_regex = undefined;
    this.enabled = undefined;
    this.type = undefined;
    this.dB = DOWNLOAD;
}
(function(UL, undefined) {
    UL.prototype.needBlock = function(file) {
        if (!this.enabled)
            return false;
        if (file.url.startsWith('data:application'))
            return false;
        if (this.type == 0)
            return !this.contains_url(file);

        return this.contains_url(file);

    }

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

    UL.prototype.contains_url = function(file) {
        if (Array.isArray(this.urls_regex) && this.urls_regex.length) {
            return this.urls_regex.some(function(item) {
                if (item.exec(file.url) || item.exec(file.finalUrl) || item.exec(file.referrer))
                    return true;
            });
        }
        return false;
    }

    UL.prototype.loadData = function(data) {
        this.urls = [];
        this.urls_regex = [];
        this.enabled = data.dwl_url_enabled;
        this.type = data.dwl_url_type;
        data.dwl_url_list.forEach(item => {
            this.urls.push(item);
            this.urls_regex.push(url_regex(item));
        });
    }

    UL.prototype.saveData = function() {
        chrome.storage.local.set(download_url_item(this.enabled, this.type, this.urls));
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

function DownloadMaxSize() {
    this.max_size = undefined;
    this.enabled = false;
}
(function(MS, undefined) {
    MS.prototype.needBlock = function(file) {
        if (!this.enabled)
            return false;
        return this.max_size < file.fileSize;
    }

    MS.prototype.loadData = function(data) {
        this.enabled = data.dwl_size_enabled;
        if (!this.enabled)
            return;
        this.max_size = data.dwl_max_size;
    }

    MS.prototype.saveData = function(data) {
        chrome.storage.local.set(download_max_size_item(this.enabled, this.max_size));
    }

    MS.prototype.setEnabled = function(data) {
        this.enabled = data;
        this.saveData;
    }

    MS.prototype.setMaxSize = function(data) {
        if (data > 0) {
            this.max_size = data;
            this.saveData();
        }
    }
})(DownloadMaxSize);

var dwl_listener = function(file) {
    DownloadBackground.getInstance().block_action(file);
}