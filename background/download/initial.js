function init_db_download(){
    chrome.storage.local.set({
        'download': download_item(0, [url_item("*.*google*.*")])
    });
}