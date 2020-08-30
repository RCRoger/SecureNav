function url_str(protocol, host, page) {
    return protocol + "://" + host + "/" + page;
}

function str_regex(text) {
    let str = "";
    if (text)
        str += text.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/[^(a-zA-Z1-9)\.\*\\ ]/g, '.');
    return str;
}

function url_item(host, protocol = '*', page = '*') {
    return {
        'protocol': protocol,
        'host': host,
        'page': page,
        'str': url_str(protocol, host, page)
    };
}

function db_url_item(db, enabled = true, type = 1, list = []) {
    var ret = {};
    ret[db.DB.URL_ENABLED] = enabled;
    ret[db.DB.URL_TYPE] = type;
    ret[db.DB.URL_LIST] = list;

    return ret;
}

function url_regex(item) {
    let str = "";
    str += str_regex(item.protocol);
    str += "\:\\/\\/";
    str += str_regex(item.host);
    str += "\\/?";
    str += str_regex(item.page);

    return new RegExp(str);
}

function get_item_from_str(url) {
    var aux = url;
    var protocol_patt = /.*\:\/\//;
    var host_patt = /.*?\//;

    var protocol = protocol_patt.exec(aux).toString();
    aux = aux.replace(protocol, '');
    protocol = protocol.replace('://', '');
    var host = host_patt.exec(aux).toString();
    aux = aux.replace(host, '');
    host = host.replace('/', '');
    var page = aux;

    return url_item(host, protocol, page);
}

function is_pattern_valid(text) {
    var item = get_item_from_str(text);

    return is_scheme_valid(item.protocol) && is_host_valid(item.host);
}

function is_scheme_valid(text) {
    const scheme = ['http', 'https', 'ftp', '*', 'file'];
    return scheme.includes(text);
}

function is_host_valid(text) {
    let pattern = /(.+\*|\*[^\.])/g;
    return !pattern.exec(text);
}