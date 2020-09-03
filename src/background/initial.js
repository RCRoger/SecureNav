function init_db() {
    chrome.storage.local.get(null, function(data) {
        let load = true;
        if (undefined == data[LOGGER.DB.LOG]) {
            init_db_logger();
            load = false;
        }
        if (undefined == data[DOWNLOAD.DB.MAX_SIZE]) {
            init_db_download();
            load = false;
        }
        if (undefined == data[PAGE.DB.SHOW_INFO]) {
            init_db_page();
            load = false;
        }
        if (undefined == data[EMERGENT.DB.SHOW_INFO]) {
            init_db_emergent();
            load = false;
        }
        if (undefined == data[SUPER.DB.PSW]) {
            init_db_super();
            load = false;
        }
        if (!load) {
            Controller.getInstance().restart_services();
        }
    });
}

chrome.runtime.onInstalled.addListener(function(reason) {
    if (reason.reason == 'install') {
        Controller.reset_db();
        init_db();
    }
    if (reason.reason == 'update') {
        init_db();
    }
});

let ctrl = Controller.getInstance();
if (!ctrl.is_init())
    ctrl.init_services();