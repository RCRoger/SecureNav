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
        if (undefined == data[SUPER.DB.ENABLED]) {
            init_db_super();
            load = false;
        }
        if (undefined == data[ELEMENT.DB.SHOW_INFO]) {
            init_db_element();
            load = false;
        }
        if (!load) {
            Controller.getInstance().restart_services();
            Controller.getInstance().load_defaults();
        }
    });
}

chrome.runtime.onInstalled.addListener(function(reason) {
    if (reason.reason == 'install')
        Controller.reset_db();
    if (reason.reason == 'install' || reason.reason == 'update')
        init_db();
});

let ctrl = Controller.getInstance();
if (!ctrl.is_init())
    ctrl.init_services();