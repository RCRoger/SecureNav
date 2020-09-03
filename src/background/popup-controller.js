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
            } else if (tabs[0].url.startsWith('chrome')) {
                chrome.tabs.sendMessage(tabs[0].id, { id: POP_UP.REQUEST.SHOW_INFO, data: data }, options.response);
            } else {
                PopUpController.inject_mdb_css(tabs[0].id);
                PopUpController.inject_mdb_scripts(tabs[0].id);
                chrome.tabs.executeScript(tabs[0].id, { file: '/src/content-scripts/popup.js' }, function() {
                    chrome.tabs.sendMessage(tabs[0].id, { id: POP_UP.REQUEST.SHOW_INFO, data: data }, options.response);
                });
            }
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

    static show_error(data, options = {}) {
        if (options.tabId) {
            PopUpController.inject_mdb_css(options.tabId);
            PopUpController.inject_mdb_scripts(options.tabId);
            chrome.tabs.executeScript(options.tabId, { file: '/src/content-scripts/popup.js' }, function() {
                chrome.tabs.sendMessage(options.tabId, { id: POP_UP.REQUEST.SHOW_ERROR, data: data }, options.response);
            });
            return;
        }
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
            if (!tabs[0]) {
                PopUpController.show_badge_text('1');
                return;
            } else if ((!tabs[0].url.startsWith('chrome-extension') && !tabs[0].url.startsWith('chrome')) || options.new_tab) {
                chrome.tabs.create({ url: '/src/errors/messages.html' }, function(tab) {
                    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                        if (info.status === 'complete' && tabId === tab.id) {
                            chrome.tabs.onUpdated.removeListener(listener);
                            chrome.tabs.sendMessage(tabId, { id: POP_UP.REQUEST.SHOW_ERROR, data: data }, options.response);
                        }
                    });
                });
            } else {
                PopUpController.inject_mdb_css(tabs[0].id);
                PopUpController.inject_mdb_scripts(tabs[0].id);
                chrome.tabs.executeScript(tabs[0].id, { file: '/src/content-scripts/popup.js' }, function() {
                    chrome.tabs.sendMessage(tabs[0].id, { id: POP_UP.REQUEST.SHOW_ERROR, data: data }, options.response);
                });
            }
        });
    }

    static show_ask(data, options = {}) {
        chrome.tabs.create({ url: '/src/errors/messages.html' }, function(tab) {
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                if (info.status === 'complete' && tabId === tab.id) {
                    chrome.tabs.onUpdated.removeListener(listener);
                    chrome.tabs.sendMessage(tabId, { id: POP_UP.REQUEST.SHOW_ASK, data: data }, options.response);
                }
            });
        });
    }

    static show_badge_text(data = '1', response = undefined) {
        chrome.browserAction.getBadgeText({}, function(badge) {
            if (badge != '!' || data == '') {
                chrome.browserAction.setBadgeText({ text: data });
            }
        });
    }

    static set_badge_title(data = '', response = undefined) {
        chrome.browserAction.setTitle({ title: data });
    }
}