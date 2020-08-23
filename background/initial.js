function init_db_superadmin(){
    chrome.storage.local.set({
        'superadmin': {
            'enabled': false,
            'password': null
        }
    });
}

function init_db(){
    init_db_download();
    init_db_superadmin();
    init_db_page();
}

chrome.runtime.onInstalled.addListener(function() {
    //init_db();
});

