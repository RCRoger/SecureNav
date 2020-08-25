class PopUpController {

    static show_info(data, response = undefined) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
            if(!tabs[0]){
                chrome.tabs.create({active:true}, function(tab){
                    chrome.tabs.sendMessage(tab.id, { id: POP_UP.REQUEST.SHOW_INFO, data: data }, response);
                });
                return;
            }
            chrome.tabs.sendMessage(tabs[0].id, { id: POP_UP.REQUEST.SHOW_INFO, data: data }, response);
        });
    }
}