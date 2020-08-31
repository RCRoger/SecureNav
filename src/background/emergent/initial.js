function init_db_emergent(callback) {
    chrome.storage.local.set(emergent_item(), callback);
}