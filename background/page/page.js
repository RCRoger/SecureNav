const webRequestFlags = [
    'blocking',
];

const all_urls = { 'urls': ["<all_urls>"] };

const block = { cancel: true };
const no_block = { cancel: false };

const pages_unblockeables = [chrome.runtime.id, 'use.fontawesome.com', 'fonts.googleapis.com'];


function PageBackground(popUp = undefined) {
    this.urls = new PageUrlList();
    this.blocks = 0;
    this.checks = 0;
    this.show_info = undefined;
    this.popUp = popUp;
    this.loadData(true);
}

(function(PB, undefined) {
    PB.prototype.request = function(request) {
        switch (request.id) {
            case PAGE.REQUEST.GET_DATA:
                return this.getData();
            case PAGE.REQUEST.URL_SET_TYPE:
                this.urls.setType(request.data);
                break;
            case PAGE.REQUEST.URL_SET_ENABLED:
                this.urls.setEnabled(request.data);
                break;
            case PAGE.REQUEST.URL_ADD_URLS:
                this.urls.add_urls(request.data);
                break;
            case PAGE.REQUEST.URL_REMOVE_URLS:
                this.urls.remove_urls(request.data.data);
                break;
            case PAGE.REQUEST.SET_SHOW_INFO:
                this.setShowInfo(request.data);
                break;
        }
        return this.getData();
    }

    PB.prototype.getData = function() {
        return { urls: this.urls };
    }

    PB.prototype.add_listener = function() {
        this.urls.add_listener();
    }

    PB.prototype.setShowInfo = function(data) {
        if (data !== true && data !== false) {
            Logger.getInstance().log('invalid_format');
            PopUpController.show_error('invalid_format');
            return;
        }
        this.show_info = data;
        this.saveData();
    }

    PB.prototype.loadData = function(first = undefined) {
        var that = this;
        chrome.storage.local.get([PAGE.DB.URL_LIST, PAGE.DB.URL_ENABLED, PAGE.DB.URL_TYPE, PAGE.DB.CHECKS, PAGE.DB.BLOCKS], function(data) {
            that.urls.loadData(data);
            that.show_info = data.dwl_show_info;
            that.checks = data[PAGE.DB.CHECKS];
            that.blocks = data[PAGE.DB.BLOCKS];
            if (first)
                that.add_listener();
        });
    }

    PB.prototype.saveData = function() {
        chrome.storage.local.set(page_item_lite(this.show_info, this.checks, this.blocks));
    }

    PB.restart = function() {
        if (PB.instance)
            delete PB.instance;
        PB.instance = new PB();;
    }

    PB.getInstance = function() {
        if (!PB.instance)
            PB.instance = new PB();
        return PB.instance;
    }

})(PageBackground);

function PageUrlList() {
    this.urls = undefined;
    this.urls_str = undefined;
    this.urls_regex = undefined;
    this.type = undefined;
    this.enabled = undefined;
}

(function(PU, undefined) {

    PU.prototype.add_listener = function() {
        if (!this.enabled) {
            window.chrome.webRequest.onBeforeRequest.removeListener(page_blocker);
            return;
        }
        if (this.type == TYPE.WHITELIST) {
            window.chrome.webRequest.onBeforeRequest.removeListener(page_blocker);
            window.chrome.webRequest.onBeforeRequest.addListener(page_blocker, all_urls, webRequestFlags);
        } else if (this.type == TYPE.BLACKLIST) {
            var filter = { 'urls': this.urls_str };
            window.chrome.webRequest.onBeforeRequest.removeListener(page_blocker);
            window.chrome.webRequest.onBeforeRequest.addListener(page_blocker, filter, webRequestFlags);
        }
    }

    PU.prototype.loadData = function(data) {
        this.urls_str = [];
        this.urls_regex = [];
        this.enabled = data[PAGE.DB.URL_ENABLED];
        this.urls = data[PAGE.DB.URL_LIST];
        this.type = data[PAGE.DB.URL_TYPE];
        if (this.urls) {
            this.urls.forEach(item => {
                this.urls_str.push(item.str);
                this.urls_regex.push(url_regex(item));
            });
        } else
            this.urls = [];
    }

    PU.prototype.saveData = function() {
        this.add_listener();
        chrome.storage.local.set(page_url_item(this.enabled, this.type, this.urls));
    }

    PU.prototype.add_urls = function(data, update) {
        data.forEach(item => {
            this.add_url(item.protocol, item.host, item.page);
        });
        this.update = update;
        this.saveData();
    }

    PU.prototype.add_url = function(protocol, host, page) {
        var item = url_item(host, protocol, page);
        this.urls.push(item);
        this.urls_str.push(item.str);
        this.urls_regex.push(url_regex(item));
    }

    PU.prototype.add_url_from_str = function(data) {
        var item = get_item_from_str(data.url);
        this.add_url(item.protocol, item.host, item.page);
        this.saveData();
    }

    PU.prototype.remove_urls = function(urls) {
        var corrector = 0;
        urls.forEach(index => {
            this.urls.splice(index - corrector, 1);
            this.urls_str.splice(index - corrector, 1);
            this.urls_regex.splice(index - corrector, 1);
            corrector++;
        });
        this.saveData();
    }

    PU.prototype.setType = function(type) {
        if (type != 0 && type != 1) {
            Logger.getInstance().log('invalid_format');
            PopUpController.show_error('invalid_format');
            return;
        }
        this.type = type;
        this.saveData();
    }

    PU.prototype.setEnabled = function(enabled) {
        if (enabled !== true && enabled !== false) {
            Logger.getInstance().log('invalid_format');
            PopUpController.show_error('invalid_format');
            return;
        }
        this.enabled = enabled;
        this.saveData();
    }

    PU.prototype.contains_url = function(page) {
        if (Array.isArray(this.urls_regex) && this.urls_regex.length) {
            return this.urls_regex.some(function(item) {
                if (item.exec(page.url))
                    return true;
            });
        }
        return false;
    }

    PU.prototype.need_block = function(page) {
        if (this.type == TYPE.WHITELIST) {
            return !this.contains_url(page);
        }
        return true;
    }



})(PageUrlList);


function page_blocker(page) {
    var url = get_item_from_str(page.url);
    let pB = PageBackground.getInstance();
    pB.checks++;
    if (pages_unblockeables.includes(url.host))
        return no_block;
    if (!pB.urls.need_block(page))
        return no_block;
    Logger.getInstance().log('pg_block ' + page.url);
    pB.blocks++;
    pB.saveData();
    PopUpController.show_badge_text();
    return block;
}