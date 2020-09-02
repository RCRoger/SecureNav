const webRequestFlags = [
    'blocking',
];

const all_urls = { 'urls': ["<all_urls>"] };

const block = { cancel: true };
const no_block = { cancel: false };

const pages_unblockeables = [chrome.runtime.id, 'use.fontawesome.com', 'fonts.googleapis.com'];


class PageBackground extends BackgroundObject {
    constructor() {
        super(PAGE);
        this.urls = new PageUrlList();
        this.loadData(true);
    }


    request(request) {
        if (request.id.includes('url')) {
            return this.urls.request(request);
        }
        switch (request.id) {
            case PAGE.REQUEST.GET_DATA:
                return this.getData();
            case PAGE.REQUEST.SET_SHOW_INFO:
                this.setShowInfo(request.data);
                break;
            case PAGE.REQUEST.EXPORT:
                Export.export_items(get_dict_values(PAGE.DB), 'pg_data');
                break;
            case PAGE.REQUEST.IMPORT:
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
        chrome.storage.local.get([PAGE.DB.URL_LIST, PAGE.DB.URL_ENABLED, PAGE.DB.URL_TYPE, PAGE.DB.CHECKS, PAGE.DB.BLOCKS], function(data) {
            that.urls.loadData(data);
            that.show_info = data.dwl_show_info;
            that.checks = data[PAGE.DB.CHECKS];
            that.blocks = data[PAGE.DB.BLOCKS];
            if (first)
                that.add_listener();
        });
    }

    static restart() {
        if (PageBackground.instance)
            delete PageBackground.instance;
        PageBackground.instance = new PageBackground();;
    }

    static getInstance() {
        if (!PageBackground.instance)
            PageBackground.instance = new PageBackground();
        return PageBackground.instance;
    }

}

class PageUrlList extends UrlBackground {
    constructor() {
        super(PAGE);
    }

    getData(data) {
        return { hasBlock: this.needBlock_all(data), type: this.type, enabled: this.enabled, url: data.url };
    }

    saveData() {
        this.add_listener();
        super.saveData();
    }

    add_listener() {
        if (!this.enabled) {
            window.chrome.webRequest.onBeforeRequest.removeListener(page_blocker);
            return;
        }
        window.chrome.webRequest.onBeforeRequest.addListener(page_blocker, all_urls, webRequestFlags);
    }

    needBlock_all(page) {
        if (this.type == TYPE.WHITELIST) {
            return !this.contains_url(page);
        }
        return this.contains_url(page);
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
        var logger = Logger.getInstance();
        var url_item = get_item_from_str(page.url);
        if (this.type == TYPE.WHITELIST) {
            if (!this.contains_url(page)) {
                logger.log('pg_block ' + page.url);
                return true;
            }
        } else if (this.type == TYPE.BLACKLIST) {
            if (this.contains_url(page)) {
                logger.log('pg_block ' + page.url);
                return true;
            }
        }
        if (this.urls_session.includes(url_item.host)) {
            return false;
        } else if (this.urls_block.includes(url_item.host)) {
            logger.log('pg_block notification_pg_blocked ' + url_item.str);
            return true;
        } else if (!this.urls_remote.includes(url_item.host)) {
            var item = this.getRemote(url_item);
            if (item.length > 0)
                item = item[0];

            if (item.action === REMOTE.ACTION.ask) {
                PopUpController.show_ask({ data: 'pg_pending ' + item.description, req: this.dB.REQUEST.URL_ASK_QUESTION, url: page.url, host: url_item });
                this.urls_remote.push(url_item.host);
                return true;
            } else if (item.action === REMOTE.ACTION.block) {
                this.urls_block.push(url_item.host);
                logger.log('pg_block ' + item.description + ' ' + url_item.str);
                return true;
            }
        }
        return false;
    }
}


function page_blocker(page) {
    try {
        var url = get_item_from_str(page.url);
        let pB = PageBackground.getInstance();
        pB.checks++;
        if (pages_unblockeables.includes(url.host))
            return no_block;
        if (!pB.urls.needBlock(page))
            return no_block;
        pB.blocks++;
        pB.saveData();
        PopUpController.show_badge_text();
    } catch (e) {
        Logger.getInstance().log(e.message, LOGGER.DB.LOG_DEV);
    }
    return block;
}