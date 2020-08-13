chrome.extension.onRequest.addListener(function (request) {
    if (request && (request.id.toString().includes('dwl')))
        dwl_background.request(request);
});