function emergent_item(enabled = false, type = 1, list = [], show_info = true, checks = 0, blocks = 0) {
    var ret = {};
    ret[EMERGENT.DB.URL_ENABLED] = enabled;
    ret[EMERGENT.DB.URL_TYPE] = type;
    ret[EMERGENT.DB.URL_LIST] = list;
    ret[EMERGENT.DB.SHOW_INFO] = show_info;
    ret[EMERGENT.DB.CHECKS] = checks;
    ret[EMERGENT.DB.BLOCKS] = blocks;
    return ret;
}

function emergent_url_item(enabled = false, type = 1, list = []) {
    var ret = {};
    ret[EMERGENT.DB.URL_ENABLED] = enabled;
    ret[EMERGENT.DB.URL_TYPE] = type;
    ret[EMERGENT.DB.URL_LIST] = list;
    return ret;
}

function emergent_item_lite(show_info = true, checks = 0, blocks = 0) {
    var ret = {};
    ret[EMERGENT.DB.SHOW_INFO] = show_info;
    ret[EMERGENT.DB.CHECKS] = checks;
    ret[EMERGENT.DB.BLOCKS] = blocks;
    return ret;
}