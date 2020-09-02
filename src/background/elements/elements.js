class ElementsBackground extends BackgroundObject {
    constructor() {
        super();
        this.list = new ElementList();
    }

    request(request) {
        switch (request.id) {
            case ELEMENT.REQUEST.GET_DATA:
                return this.getData();
        }
    }

    loadData() {
        var that = this;
        chrome.local.storage.get(get_dict_values(ELEMENT.DB), function(data) {
            that.list.loadData(data);
            this.checks = data[ELEMENT.DB.CHECKS];
            this.blocks = data[ELEMENT.DB.BLOCKS];
            this.show_info = data[ELEMENT.DB.SHOW_INFO];
        });
    }

    saveData() {
        chrome.storage.local.set(element_lite_item(this.show_info, this.checks, this.blocks));
    }

    static getInstance() {
        if (!ElementsBackground.instance)
            ElementsBackground.instance = new ElementsBackground();
        return ElementsBackground.instance;
    }

    static restart() {
        if (ElementsBackground.instance)
            delete ElementsBackground.instance;
        ElementsBackground.instance = new ElementsBackground();
    }
}

class ElementList {
    constructor() {
        this.list = undefined;
        this.enabled = undefined;
    }

    loadData(data) {
        this.list = data[ELEMENT.DB.LIST];
        this.enabled = data[ELEMENT.DB.LIST_ENABLED];
    }

    saveData() {
        chrome.storage.local.set(element_list_item(this.list, this.enabled));
    }

    add_element(url, elem) {
        if (!this.list[url])
            this.list[url] = [];
        this.list[url].push(elem);
    }

    remove_element(url, elem) {
        if (this.list[url])
            this.list[url].remove(elem);
    }

    clear_url(url) {
        this.list[url] = null;
    }
}