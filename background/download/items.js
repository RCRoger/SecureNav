function download_item(type = 0, list = [], max_size = undefined){
    return {
        'type':type,
        'url_list':list,
        'max_size':max_size,
        'show_info': true,

    };
}