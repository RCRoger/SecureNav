chrome.runtime.onInstalled.addListener(function() {
    init_db_superadmin();
});

function init_db(){

}

function init_db_options(){
}

function init_db_superadmin(){
    chrome.storage.local.set("superadmin", {
        "enabled": false
    });
}