class PopUpController {

    static show_info(data, options = {}) {
        if (options.tabId) {
            PopUpController.inject_mdb_css(options.tabId);
            PopUpController.inject_mdb_scripts(options.tabId);
            chrome.tabs.executeScript(options.tabId, { file: '/src/content-scripts/popup.js' }, function() {
                chrome.tabs.sendMessage(options.tabId, { id: POP_UP.REQUEST.SHOW_INFO, data: data }, options.response);
            });
            return;
        }
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
            if (!tabs[0]) {
                chrome.browserAction.setBadgeText({ text: '1' });
                return;
            }
            PopUpController.inject_mdb_css(tabs[0].id);
            PopUpController.inject_mdb_scripts(tabs[0].id);
            chrome.tabs.executeScript(tabs[0].id, { file: '/src/content-scripts/popup.js' }, function() {
                chrome.tabs.sendMessage(tabs[0].id, { id: POP_UP.REQUEST.SHOW_INFO, data: data }, options.response);
            });
        });
    }

    static inject_mdb_scripts(tabId) {
        chrome.tabs.executeScript(tabId, { file: '/src/js/jquery.min.js' });
        chrome.tabs.executeScript(tabId, { file: '/src/js/bootstrap.min.js' });
        chrome.tabs.executeScript(tabId, { file: '/src/js/mdb.min.js' });
        chrome.tabs.executeScript(tabId, { file: '/src/background/constants.js' });
        chrome.tabs.executeScript(tabId, { file: '/src/js/utils.js' });
    }

    static inject_mdb_css(tabId) {
        chrome.tabs.insertCSS(tabId, { file: '/src/css/bootstrap.min.css' });
        chrome.tabs.insertCSS(tabId, { file: '/src/css/mdb.lite.min.css' });
    }

    static show_error(data, response = undefined) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
            if (!tabs[0]) {
                chrome.browserAction.setBadgeText({ text: '1' });
                return;
            }
            PopUpController.inject_mdb_css(tabs[0].id);
            PopUpController.inject_mdb_scripts(tabs[0].id);
            chrome.tabs.executeScript(tabs[0].id, function() {
                chrome.tabs.sendMessage(tabs[0].id, { id: POP_UP.REQUEST.SHOW_ERROR, data: data }, response);
            });
        });
    }

    static show_badge_text(data, response = undefined) {
        chrome.browserAction.setBadgeText({ text: '1' });
    }
}