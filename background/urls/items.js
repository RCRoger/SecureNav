function url_str(protocol, host, page){
    return protocol + "://" + host + "/" + page;
}

function str_regex(text){
    let str = "";
    if(text)
        str += text.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/[^(a-zA-Z1-9)\.\*\\ ]/g, '.');
    return str;
}

function url_item(host, protocol = '*', page = '*'){
    return {
            'protocol': protocol,
            'host': host,
            'page': page,
            'str': url_str(protocol, host, page)
        };
}

function url_regex(item){
    let str = "";
    str += str_regex(item.protocol);
    str += "\:\\/\\/";
    str += str_regex(item.host);
    str += "\\/?";
    str += str_regex(item.page);

    return new RegExp(str);
}