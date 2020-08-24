function DownloadBackground() {
    this.urls = new DownloadUrlList();
    this.max_size = new DownloadMaxSize();
    this.show_info = undefined;
    this.loadData(true);
}

(function (DB, undefined) {

    DB.prototype.request = function (request) {
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
                this.urls.add_urls(request.data, request.update);
                break;
            case DOWNLOAD.REQUEST.URL_REMOVE_URLS:
                this.urls.remove_urls(request.data.data, request.data.update);
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
        }
        return this.get_data();
    }

    DB.prototype.get_data = function () {
        return { urls: this.urls, max_size: this.max_size };
    }

    DB.prototype.block_action = function (file, url) {
        chrome.downloads.pause(file.id);
        Logger.getInstance().log('Download Paused', LOGGER.DB.LOG_DEV);

        if (this.urls.needBlock(file) || this.max_size.needBlock(file)) {
            chrome.downloads.cancel(file.id);
            Logger.getInstance().log('Download Canceled', LOGGER.DB.LOG_DEV);
            Logger.getInstance().log('Download Canceled');
            PopUpController.show_info('Descarrega cancelada');
            return;
        }
        chrome.downloads.resume(file.id);
        
        Logger.getInstance().log('Download Resumed', LOGGER.DB.LOG_DEV);

    }

    DB.prototype.add_listener = function () {
        chrome.downloads.onCreated.removeListener(dwl_listener);
        chrome.downloads.onCreated.addListener(dwl_listener);
    }

    DB.prototype.loadData = function (first = undefined) {
        var that = this;
        var params = [
            DOWNLOAD.DB.URL_ENABLED,
            DOWNLOAD.DB.URL_TYPE,
            DOWNLOAD.DB.URL_LIST,
            DOWNLOAD.DB.SIZE_ENABLED,
            DOWNLOAD.DB.MAX_SIZE,
            DOWNLOAD.DB.SHOW_INFO
        ];
        chrome.storage.local.get(params, function (data) {
            that.urls.loadData(data);
            that.max_size.loadData(data);
            that.show_info = data.dwl_show_info;
            if (first)
                that.add_listener();
        });
    }

    DB.restart = function(){
        if(DB.instance)
            delete DB.instance;
        DB.instance = new DB();
    }

    DB.getInstance = function(){
        if(!DB.instance)
            DB.instance = new DB();
        return DB.instance;
    }

})(DownloadBackground);

function DownloadUrlList() {
    this.urls = undefined;
    this.urls_regex = undefined;
    this.enabled = undefined;
    this.type = undefined;
}
(function (UL, undefined) {
    UL.prototype.needBlock = function (file) {
        if (!this.enabled)
            return false;
        if (this.type == 0)
            return !this.contains_url(file);

        return this.contains_url(file);

    }

    UL.prototype.edit_url = function (data) {
        if (!data.index || data.index > this.urls.length || data.index) {
            //TODO: add error
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

    UL.prototype.contains_url = function (file) {
        if (Array.isArray(this.urls_regex) && this.urls_regex.length) {
            return this.urls_regex.some(function (item) {
                if (item.exec(file.url) || item.exec(file.finalUrl) || item.exec(file.referrer))
                    return true;
            });
        }
        return false;
    }

    UL.prototype.loadData = function (data) {
        this.urls = [];
        this.urls_regex = [];
        this.enabled = data.dwl_url_enabled;
        this.type = data.dwl_url_type;
        data.dwl_url_list.forEach(item => {
            this.urls.push(item);
            this.urls_regex.push(url_regex(item));
        });
    }

    UL.prototype.saveData = function () {
        chrome.storage.local.set(download_url_item(this.enabled, this.type, this.urls));
    }

    UL.prototype.add_urls = function (data, update) {
        data.forEach(item => {
            this.add_url(item.protocol, item.host, item.page);
        });
        this.update = update;
        this.saveData();
    }

    UL.prototype.add_url = function (protocol, host, page) {
        var item = url_item(host, protocol, page);
        this.urls.push(item);
        this.urls_regex.push(url_regex(item));
    }

    UL.prototype.add_url_from_str = function (data) {
        var item = get_item_from_str(data.url);
        this.urls.push(item);
        this.urls_regex.push(url_regex(item));
        this.saveData();
    }



    UL.prototype.remove_urls = function (urls, update) {
        var corrector = 0;
        urls.forEach(index => {
            this.urls.splice(index - corrector, 1);
            this.urls_regex.splice(index - corrector, 1);
            corrector++;
        });
        this.update = update;
        this.saveData();
    }

    UL.prototype.getData = function (data) {
        return { hasBlock: this.needBlock(data), type: this.type, enabled: this.enabled, url: data.url };
    }

    UL.prototype.setType = function (type) {
        if (type != 0 && type != 1) {
            //TODO: send error
            return;
        }
        this.type = type;
        this.saveData();
    }

    UL.prototype.setEnabled = function (enabled) {
        if (enabled !== true && enabled !== false) {
            //TODO: send error
            return;
        }
        this.enabled = enabled;
        this.saveData();
    }

})(DownloadUrlList);

function DownloadMaxSize() {
    this.max_size = undefined;
    this.enabled = false;
}
(function (MS, undefined) {
    MS.prototype.needBlock = function (file) {
        if (!this.enabled)
            return false;
        return this.max_size > file.fileSize;
    }

    MS.prototype.loadData = function (data) {
        this.enabled = data.dwl_size_enabled;
        if (!this.enabled)
            return;
        this.max_size = data.dwl_max_size;
    }

    MS.prototype.saveData = function (data) {
        chrome.storage.local.set(download_max_size_item(this.enabled, this.max_size));
    }

    MS.prototype.setEnabled = function (data) {
        this.enabled = data;
        this.saveData;
    }

    MS.prototype.setMaxSize = function (data) {
        if (data > 0) {
            this.max_size = data;
            this.saveData();
        }
    }
})(DownloadMaxSize);

var dwl_listener = function (file) {
    DownloadBackground.getInstance().block_action(file);
}