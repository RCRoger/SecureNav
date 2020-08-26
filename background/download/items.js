function download_item(enabled = true, type = 1, list = [], size_enabled = true, max_size = undefined, show_info = true, blocks = 0, checks = 0) {

    var ret = {};
    ret[DOWNLOAD.DB.URL_ENABLED] = enabled;
    ret[DOWNLOAD.DB.URL_TYPE] = type;
    ret[DOWNLOAD.DB.URL_LIST] = list;
    ret[DOWNLOAD.DB.SIZE_ENABLED] = size_enabled;
    ret[DOWNLOAD.DB.MAX_SIZE] = max_size;
    ret[DOWNLOAD.DB.SHOW_INFO] = show_info;
    ret[DOWNLOAD.DB.CHECKS] = checks;
    ret[DOWNLOAD.DB.BLOCKS] = blocks;


    return ret;
}

function download_item_lite(show_info = true, blocks = 0, checks = 0) {
    var ret = {};
    ret[DOWNLOAD.DB.SHOW_INFO] = show_info;
    ret[DOWNLOAD.DB.CHECKS] = checks;
    ret[DOWNLOAD.DB.BLOCKS] = blocks;
    return ret;
}

function download_url_item(enabled = true, type = 1, list = []) {
    var ret = {};
    ret[DOWNLOAD.DB.URL_ENABLED] = enabled;
    ret[DOWNLOAD.DB.URL_TYPE] = type;
    ret[DOWNLOAD.DB.URL_LIST] = list;

    return ret;
}

function download_max_size_item(enabled = true, value = undefined) {

    var ret = {};

    ret[DOWNLOAD.DB.SIZE_ENABLED] = enabled;
    ret[DOWNLOAD.DB.MAX_SIZE] = value;

    return ret;
}