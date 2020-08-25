const DOWNLOAD = {
    REQUEST :{
        DWL_UPDATE:'dwl_update',
        GET_DATA: 'dwl_get_data',
        URL_SET_TYPE: 'dwl_url_set_type',
        URL_SET_ENABLED: 'dwl_url_set_enabled',
        URL_ADD_URLS: 'dwl_url_add_urls',
        URL_REMOVE_URLS: 'dwl_url_remove_urls',
        SIZE_SET_ENABLED: 'dwl_size_set_enabled',
        SIZE_SET_VAL: 'dwl_size_set_val',
        URL_GET_DATA: 'dwl_url_get_data',
        ADD_URL: 'dwl_add_url',
        URL_SET_ENABLED_LITE: 'dwl_url_set_enabled_lite',
        SET_SHOW_INFO: 'dwl_set_show_info'
    },
    DB:{
        URL_ENABLED: 'dwl_url_enabled',
        URL_TYPE: 'dwl_url_type',
        URL_LIST: 'dwl_url_list',
        SIZE_ENABLED: 'dwl_size_enabled',
        MAX_SIZE: 'dwl_max_size',
        SHOW_INFO: 'dwl_show_info',
        CHECKS: 'dwl_checks',
        BLOCKS: 'dwl_blocks'
    }
}

const PAGE = {
    REQUEST:{
        GET_DATA: 'pg_get_data',
        URL_SET_TYPE: 'pg_url_set_type',
        URL_SET_ENABLED: 'pg_url_set_enabled',
        URL_ADD_URLS: 'pg_url_add_urls',
        URL_REMOVE_URLS: 'pg_url_remove_urls',
    },
    DB:{
        URL_ENABLED: 'pg_url_enabled',
        URL_TYPE: 'pg_url_type',
        URL_LIST: 'pg_url_list',
        SHOW_INFO: 'pg_show_info',
        BLOCKS: 'pg_blocks'
    }
}

const POP_UP = {
    REQUEST: {
        SHOW_INFO : 'pop_up_show_info'
    }
}

const LOGGER = {
    MAX_ROWS: 10000,
    DB:{
        LOG : 'logger_msg',
        LOG_DEV: 'logger_dev'
    }
}

const TYPE = {
    WHITELIST : 0,
    BLACKLIST : 1
}