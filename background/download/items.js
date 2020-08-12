function download_item(enabled = true, type = 0, list = [], max_size = undefined, show_info = true){
    return {
        'dwl_enabled':enabled,
        'dwl_type':type,
        'dwl_url_list':list,
        'dwl_max_size':max_size,
        'dwl_show_info': show_info,
    };
}