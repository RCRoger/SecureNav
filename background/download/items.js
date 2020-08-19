function download_item(enabled = true, type = 0, list = [], size_enabled = true, max_size = undefined, show_info = true){

    var ret = {};
    ret[DOWNLOAD.DB.DWL_URL_ENABLED] = enabled;
    ret[DOWNLOAD.DB.DWL_URL_TYPE] = type;
    ret[DOWNLOAD.DB.DWL_URL_LIST] = list;
    ret[DOWNLOAD.DB.DWL_SIZE_ENABLED] = size_enabled;
    ret[DOWNLOAD.DB.DWL_MAX_SIZE] = max_size;
    ret[DOWNLOAD.DB.DWL_SHOW_INFO] = show_info;

    return ret;
}

function download_url_item(enabled = true, type = 0, list = []){
    var ret = {};
    ret[DOWNLOAD.DB.DWL_URL_ENABLED] = enabled;
    ret[DOWNLOAD.DB.DWL_URL_TYPE] = type;
    ret[DOWNLOAD.DB.DWL_URL_LIST] = list;

    return ret;
}

function download_max_size_item(enabled = true, value = undefined){

    var ret = {};
    
    ret[DOWNLOAD.DB.DWL_SIZE_ENABLED] = enabled;
    ret[DOWNLOAD.DB.DWL_MAX_SIZE] = value;

    return ret;
}