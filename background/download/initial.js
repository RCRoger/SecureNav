function init_db_download(){
    chrome.storage.local.set(
        download_item(undefined, 1, [url_item("*.*google*.*")])
    );
}