function init_db_superadmin() {
    chrome.storage.local.set({
        'superadmin': {
            'enabled': false,
            'password': null
        }
    });
}

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
        if (!load) {
            Controller.getInstance().restart_services();
        }
    });
}

chrome.runtime.onInstalled.addListener(function(reason) {
    if (reason.reason == 'install' || reason.reason == 'update')
        init_db();
    Controller.getInstance().init_services();
});