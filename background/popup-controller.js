class PopUpController {

    static show_info(data, response = undefined) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
            if (!tabs[0]) {
                chrome.browserAction.setBadgeText({ text: '1' });
                return;
            }
            chrome.tabs.sendMessage(tabs[0].id, { id: POP_UP.REQUEST.SHOW_INFO, data: data }, response);
        });
    }

    static show_badge_text(data, response = undefined) {

        chrome.browserAction.setBadgeText({ text: '1' });
    }
}