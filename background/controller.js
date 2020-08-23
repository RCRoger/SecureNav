var request = function (request, sender, response) {
    if (request && (request.id.toString().includes('dwl')))
        response(dwl_background.request(request));
    else if (request && (request.id.toString().includes('pg')))
        response(page_background.request(request));
    return true;
}

chrome.runtime.onMessage.addListener(request);