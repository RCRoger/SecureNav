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
        if (undefined === data[LOGGER.DB.LOG])
            init_db_logger();
        if (undefined === data[DOWNLOAD.DB.MAX_SIZE])
            init_db_download();
        if (undefined === data[PAGE.DB.SHOW_INFO])
            init_db_page();
        if (undefined === data[EMERGENT.DB.SHOW_INFO])
            init_db_emergent();
        controller.restart_services();
    });
}

chrome.runtime.onInstalled.addListener(function(reason) {
    init_db();
});