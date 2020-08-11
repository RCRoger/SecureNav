function download_item(type = 0, list = [], max_size = -1){
    return {
        'type':type,
        'url_list':list,
        'max_size':max_size
    };
}