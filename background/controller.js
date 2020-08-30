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

var count_blocks = function() {
    return DownloadBackground.getInstance().blocks + PageBackground.getInstance().blocks;
}

var count_checks = function() {
    return DownloadBackground.getInstance().checks + PageBackground.getInstance().checks;
}

var get_count = function() {
    return { blocks: count_blocks(), checks: count_checks() }
}

var request_ctrl = function(request) {
    switch (request.id) {
        case CONTROLLER.REQUEST.GET_DATA:
            return get_count();
        case CONTROLLER.REQUEST.EXPORT:
            Export.export_items();
            break;
    }
}

var request = function(request, sender, response) {
    if (request && (request.id.toString().includes('dwl')))
        response(DownloadBackground.getInstance().request(request));
    else if (request && (request.id.toString().includes('pg')))
        response(PageBackground.getInstance().request(request));
    else if (request && (request.id.toString().includes('log')))
        response(Logger.getInstance().request(request));
    else if (request && (request.id.toString().includes('ctr')))
        response(request_ctrl(request));
    return true;
}

init_services();