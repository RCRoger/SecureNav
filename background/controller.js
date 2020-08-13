chrome.extension.onRequest.addListener(function (request) {
    if (request && (request.id == "update_dwl"))
        dwl_background.add_listener();
});