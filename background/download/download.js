class DownloadBackground {
    constructor() {
        this.urls = new DownloadUrlList();
        this.max_size = new DownloadMaxSize();
        this.show_info = undefined;
        this.checks = 0;
        this.blocks = 0;
        this.loadData(true);
    }

    request(request) {
        if (request.id.includes('url')) {
            return this.urls.request(request);
        }
        switch (request.id) {
            case DOWNLOAD.REQUEST.GET_DATA:
                return this.get_data();
            case DOWNLOAD.REQUEST.SIZE_SET_ENABLED:
                this.max_size.setEnabled(request.data);
                break;
            case DOWNLOAD.REQUEST.SIZE_SET_VAL:
                this.max_size.setMaxSize(request.data);
                break;
            case DOWNLOAD.REQUEST.SET_SHOW_INFO:
                this.setShowInfo(request.data);
                break;
            case DOWNLOAD.REQUEST.EXPORT:
                Export.export_items(get_dict_values(DOWNLOAD.DB), 'dwl_data');
                return;
            case DOWNLOAD.REQUEST.IMPORT:
                this.import(request.data.data, request.data.file, request.data.override);
                break;
            default:
                Logger.getInstance().log('invalid_format' + ' ' + request.id, LOGGER.DB.LOG_DEV);
                PopUpController.show_error('invalid_format');
                return;
        }
        return this.get_data();
    }

    get_data() {
        return this;
    }

    import (data, file, override) {
        switch (Import.get_file_extension(file)) {
            case 'json':
                this.urls.import_json(data, override);
                //this.max_size.import_json(data);
                break;
            case 'csv':
                this.urls.import_urls_csv(data, override);
                break;
            case 'txt':
                this.urls.import_urls_txt(data, override);
                break;
            default:
                Logger.getInstance().log('invalid_format', LOGGER.DB.LOG_DEV);
                PopUpController.show_error('invalid_format');
                break;
        }
    }

    setShowInfo(data) {
        if (data !== true && data !== false) {
            Logger.getInstance().log('invalid_format', LOGGER.DB.LOG_DEV);
            PopUpController.show_error('invalid_format');
            return;
        }
        this.show_info = data;
        this.saveDataLite();
    }

    block_action(file) {
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

    add_listener() {
        chrome.downloads.onCreated.removeListener(dwl_listener);
        chrome.downloads.onCreated.addListener(dwl_listener);
    }

    loadData(first = undefined) {
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

    saveDataLite() {
        chrome.storage.local.set(download_item_lite(this.show_info, this.blocks, this.checks));
    }

    static restart() {
        if (DownloadBackground.instance)
            delete DownloadBackground.instance;
        DownloadBackground.instance = new DownloadBackground();
    }

    static getInstance() {
        if (!DownloadBackground.instance)
            DownloadBackground.instance = new DownloadBackground();
        return DownloadBackground.instance;
    }

}

class DownloadUrlList extends UrlBackground {
    constructor() {
        super(DOWNLOAD);
    }
    needBlock(file) {
        if (!this.enabled)
            return false;
        if (file.url.startsWith('data:application'))
            return false;
        if (this.type == 0)
            return !this.contains_url(file);

        return this.contains_url(file);

    }

    contains_url(file) {
        if (Array.isArray(this.urls_regex) && this.urls_regex.length) {
            return this.urls_regex.some(function(item) {
                if (item.exec(file.url) || item.exec(file.finalUrl) || item.exec(file.referrer))
                    return true;
            });
        }
        return false;
    }

}

class DownloadMaxSize {
    constructor() {
        this.max_size = undefined;
        this.enabled = false;
    }

    needBlock(file) {
        if (!this.enabled)
            return false;
        return this.max_size < file.fileSize;
    }

    loadData(data) {
        this.enabled = data.dwl_size_enabled;
        if (!this.enabled)
            return;
        this.max_size = data.dwl_max_size;
    }

    saveData() {
        chrome.storage.local.set(download_max_size_item(this.enabled, this.max_size));
    }

    setEnabled(data) {
        this.enabled = data;
        this.saveData;
    }

    setMaxSize(data) {
        if (data > 0) {
            this.max_size = data;
            this.saveData();
        }
    }
}

function dwl_listener(file) {
    DownloadBackground.getInstance().block_action(file);
}