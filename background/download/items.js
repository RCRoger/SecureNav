function download_item(enabled = true, type = 0, list = [], size_enabled = true, max_size = undefined, show_info = true){
    return {
        'dwl_url_enabled':enabled,
        'dwl_url_type':type,
        'dwl_url_list':list,
        'dwl_size_enabled': size_enabled,
        'dwl_max_size':max_size,
        'dwl_show_info': show_info,
    };
}

function download_url_item(enabled = true, type = 0, list = []){
    return {
        'dwl_url_enabled':enabled,
        'dwl_url_type':type,
        'dwl_url_list':list,
    };
}