class EmergentBackground {
    constructor() {
        this.urls = new EmergentUrlList();
        this.blocks = 0;
        this.checks = 0;
        this.show_info = undefined;
        this.loadData(true);
    }


    request(request) {
        if (request.id.includes('url')) {
            return this.urls.request(request);
        }
        switch (request.id) {
            case EMERGENT.REQUEST.GET_DATA:
                return this.getData();
            case EMERGENT.REQUEST.SET_SHOW_INFO:
                this.setShowInfo(request.data);
                break;
            case EMERGENT.REQUEST.EXPORT:
                Export.export_items(get_dict_values(EMERGENT.DB), 'pg_data');
                break;
            case EMERGENT.REQUEST.IMPORT:
                this.import(request.data.data, request.data.file, request.data.override);
                break;
            default:
                Logger.getInstance().log('invalid_format' + ' ' + request.id, LOGGER.DB.LOG_DEV);
                PopUpController.show_error('invalid_format');
                return;
        }
        return this.getData();
    }

    import (data, file, override) {
        switch (Import.get_file_extension(file)) {
            case 'json':
                this.urls.import_json(data, override);
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

    getData() {
        return { urls: this.urls };
    }

    add_listener() {
        this.urls.add_listener();
    }

    setShowInfo(data) {
        if (data !== true && data !== false) {
            Logger.getInstance().log('invalid_format', LOGGER.DB.LOG_DEV);
            PopUpController.show_error('invalid_format');
            return;
        }
        this.show_info = data;
        this.saveData();
    }

    loadData(first = undefined) {
        var that = this;
        chrome.storage.local.get([EMERGENT.DB.URL_LIST, EMERGENT.DB.URL_ENABLED, EMERGENT.DB.URL_TYPE, EMERGENT.DB.CHECKS, EMERGENT.DB.BLOCKS], function(data) {
            that.urls.loadData(data);
            that.show_info = data.dwl_show_info;
            that.checks = data[EMERGENT.DB.CHECKS];
            that.blocks = data[EMERGENT.DB.BLOCKS];
            if (first)
                that.add_listener();
        });
    }

    saveData() {
        chrome.storage.local.set(emergent_item_lite(this.show_info, this.checks, this.blocks));
    }

    static restart() {
        if (EmergentBackground.instance)
            delete EmergentBackground.instance;
        EmergentBackground.instance = new EmergentBackground();;
    }

    static getInstance() {
        if (!EmergentBackground.instance)
            EmergentBackground.instance = new EmergentBackground();
        return EmergentBackground.instance;
    }

}

class EmergentUrlList extends UrlBackground {
    constructor() {
        super(EMERGENT);
    }

    getData(data) {
        return { hasBlock: this.needBlock_all(data), type: this.type, enabled: this.enabled, url: data.url };
    }

    saveData() {
        this.add_listener();
        super.saveData();
    }

    add_listener() {

        chrome.tabs.onCreated.removeListener(pop_up_blocker);
        if (this.enabled) {
            chrome.tabs.onCreated.addListener(pop_up_blocker);
        }
    }

    contains_url(page) {
        if (Array.isArray(this.urls_regex) && this.urls_regex.length) {
            return this.urls_regex.some(function(item) {
                if (item.exec(page.url))
                    return true;
            });
        }
        return false;
    }

    needBlock(page) {
        if (this.type == TYPE.WHITELIST) {
            return !this.contains_url(page);
        }
        return true;
    }
}

function pop_up_blocker(tab) {
    var desu = undefined;
}