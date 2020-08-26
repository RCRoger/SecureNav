function page_item(enabled = false, type = 1, list = [], show_info = true) {
    var ret = {};
    ret[PAGE.DB.URL_ENABLED] = enabled;
    ret[PAGE.DB.URL_TYPE] = type;
    ret[PAGE.DB.URL_LIST] = list;
    ret[PAGE.DB.SHOW_INFO] = show_info;
    return ret;
}

function page_url_item(enabled = false, type = 1, list = [], show_info = true) {
    var ret = {};
    ret[PAGE.DB.URL_ENABLED] = enabled;
    ret[PAGE.DB.URL_TYPE] = type;
    ret[PAGE.DB.URL_LIST] = list;
    return ret;
}