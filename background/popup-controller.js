class PopUpController {

    static show_info(data, response = undefined) {
        chrome.tabs.query({ lastFocusedWindow: true }, function (tabs) {
            chrome.pageAction.show(tabs[0].id);
            chrome.tabs.sendMessage(tabs[0].id, { id: POP_UP.REQUEST.SHOW_INFO, data: data }, response);
        });
    }
}