class EmergentBackground extends BackgroundObject {
    constructor() {
        super(EMERGENT);
        this.urls = new EmergentUrlList();
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
                Export.export_items(get_dict_values(EMERGENT.DB), 'eme_data');
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

    add_listener() {
        this.urls.add_listener();
    }

    loadData(first = undefined) {
        var that = this;
        chrome.storage.local.get(get_dict_values(EMERGENT.DB), function(data) {
            that.urls.loadData(data);
            that.show_info = data[EMERGENT.DB.SHOW_INFO];
            that.checks = data[EMERGENT.DB.CHECKS];
            that.blocks = data[EMERGENT.DB.BLOCKS];
            if (first)
                that.add_listener();
        });
    }

    needBlock(tab) {
        let logger = Logger.getInstance();
        this.checks++;
        if (this.urls.needBlock(tab)) {
            this.blocks++;
            this.saveData();
            if (this.show_info)
                PopUpController.show_info('pop_up_blocked', { tabId: tab.id });
            logger.log('pop_up_blocked');
            logger.log('pop_up_blocked' + ' ' + tab.url, LOGGER.DB.LOG_DEV);
            return true;
        }
        return false;
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
        return { hasBlock: this.needBlock(data), type: this.type, enabled: this.enabled, url: data.url };
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

    contains_url(tab) {
        if (Array.isArray(this.urls_regex) && this.urls_regex.length) {
            return this.urls_regex.some(function(item) {
                if (item.exec(tab.url))
                    return true;
            });
        }
        return false;
    }

    needBlock(tab) {
        if (this.type == TYPE.WHITELIST) {
            return !this.contains_url(tab);
        }
        return this.contains_url(tab);
    }
}

function pop_up_blocker(new_tab) {
    try {
        if (new_tab.openerTabId) {
            var a = new_tab.pendingUrl ? new_tab.pendingUrl : new_tab.url ? new_tab.url : undefined;
            if (a) {
                let item = get_item_from_str(a);
                if (item.protocol == 'chrome' || item.protocol == 'chrome:extension')
                    return;
            }
            var blocker = EmergentBackground.getInstance();
            chrome.tabs.get(new_tab.openerTabId, function(tab) {
                //tab.windowId !== new_tab.windowId && 
                if (blocker.needBlock(tab)) {
                    chrome.tabs.remove(new_tab.id);
                }
            });
        }
    } catch (e) {
        Logger.getInstance().log(e.message, LOGGER.DB.LOG_DEV);
    }
}