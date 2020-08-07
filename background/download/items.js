function download_item(type = 0, list = [], max_size = -1){
    return {
        'type':type,
        'url_list':list,
        'max_size':max_size
    };
}

function url_str(protocol, host, page){
    return protocol + "://" + host + "/" + page;
}

function url_item(host, protocol = '*', page = '*'){
    return {
            'protocol': protocol,
            'host': host,
            'page': page,
            'str': url_str(protocol, host, page)
        };
}