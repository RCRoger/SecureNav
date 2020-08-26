var init_services = function() {
    Logger.getInstance();
    DownloadBackground.getInstance();
    PageBackground.getInstance();
    chrome.runtime.onMessage.addListener(request);
}


var restart_services = function() {
    Logger.restart();
    DownloadBackground.restart();
    PageBackground.restart();
    chrome.runtime.onMessage.removeListener(request);
    chrome.runtime.onMessage.addListener(request);
}


var request = function(request, sender, response) {
    if (request && (request.id.toString().includes('dwl')))
        response(DownloadBackground.getInstance().request(request));
    else if (request && (request.id.toString().includes('pg')))
        response(PageBackground.getInstance().request(request));
    else if (request && (request.id.toString().includes('log')))
        response(Logger.getInstance().request(request));
    return true;
}

init_services();