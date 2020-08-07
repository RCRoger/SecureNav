function init_db_download(){
    chrome.storage.local.set({
        'download': download_item()
    });
}