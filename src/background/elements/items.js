function element_item(show_info = true, checks = 0, blocks = 0, list = [], list_enabled = true) {
    var ret = {}
    ret[ELEMENT.DB.SHOW_INFO] = show_info;
    ret[ELEMENT.DB.CHECKS] = checks;
    ret[ELEMENT.DB.BLOCKS] = blocks;
    ret[ELEMENT.DB.LIST] = list;
    ret[ELEMENT.DB.LIST_ENABLED] = list_enabled;

    return ret;
}

function element_list_item(list = {}, list_enabled = true) {
    var ret = {}
    ret[ELEMENT.DB.LIST] = list;
    ret[ELEMENT.DB.LIST_ENABLED] = list_enabled;

    return ret;
}

function element_lite_item(show_info = true, checks = 0, blocks = 0) {
    var ret = {}
    ret[ELEMENT.DB.SHOW_INFO] = show_info;
    ret[ELEMENT.DB.CHECKS] = checks;
    ret[ELEMENT.DB.BLOCKS] = blocks;

    return ret;
}