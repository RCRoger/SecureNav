function page_item(enabled = true, type = 0, list = [],  show_info = true){
    return {
        'pg_url_enabled':enabled,
        'pg_url_type':type,
        'pg_url_list':list,
        'pg_show_info': show_info,
    };
}