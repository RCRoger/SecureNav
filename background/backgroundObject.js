class BackgroundObject {
    constructor(db) {
        this.show_info = undefined;
        this.checks = 0;
        this.blocks = 0;
        this.db = db;
    }

    getData() {
        return this;
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

    saveData() {
        chrome.storage.local.set(item_lite(this.db, this.show_info, this.blocks, this.checks));
    }
}