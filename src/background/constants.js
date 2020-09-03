const REMOTE = {
    HOST: '127.0.0.1:8000',
    URL: 'http://127.0.0.1:8000/secnav/',
    ACTION: {
        nothing: '0',
        ask: '1',
        block: '2'
    },
    DB: {
        ID: 'rmt_id'
    },
    TIME: 120
}

const DOWNLOAD = {
    REQUEST: {
        DWL_UPDATE: 'dwl_update',
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
        SET_SHOW_INFO: 'dwl_set_show_info',
        EXPORT: 'dwl_export',
        IMPORT: 'dwl_import',
        URL_ASK_QUESTION: 'dwl_url_question',
    },
    DB: {
        URL_ENABLED: 'dwl_url_enabled',
        URL_TYPE: 'dwl_url_type',
        URL_LIST: 'dwl_url_list',
        SIZE_ENABLED: 'dwl_size_enabled',
        MAX_SIZE: 'dwl_max_size',
        SHOW_INFO: 'dwl_show_info',
        CHECKS: 'dwl_checks',
        BLOCKS: 'dwl_blocks',

    },
    REMOTE: {
        URL: REMOTE.URL + 'downloads/',
        URL_DEFAULT: REMOTE.URL + 'default/downloads',
    },
    ALIAS: 'dwl'
}

const PAGE = {
    REQUEST: {
        GET_DATA: 'pg_get_data',
        URL_SET_TYPE: 'pg_url_set_type',
        URL_SET_ENABLED: 'pg_url_set_enabled',
        URL_ADD_URLS: 'pg_url_add_urls',
        URL_REMOVE_URLS: 'pg_url_remove_urls',
        SET_SHOW_INFO: 'pg_set_show_info',
        URL_GET_DATA: 'pg_url_get_data',
        ADD_URL: 'pg_add_url',
        URL_SET_ENABLED_LITE: 'pg_url_set_enabled_lite',
        EXPORT: 'pg_export',
        IMPORT: 'pg_import',
        URL_ASK_QUESTION: 'pg_url_question',
    },
    DB: {
        URL_ENABLED: 'pg_url_enabled',
        URL_TYPE: 'pg_url_type',
        URL_LIST: 'pg_url_list',
        SHOW_INFO: 'pg_show_info',
        BLOCKS: 'pg_blocks',
        CHECKS: 'pg_checks'
    },
    REMOTE: {
        URL: REMOTE.URL + 'pages/',
        URL_DEFAULT: REMOTE.URL + 'default/pages/'
    },
    ALIAS: 'pg'
}

const EMERGENT = {
    REQUEST: {
        GET_DATA: 'eme_get_data',
        URL_SET_TYPE: 'eme_url_set_type',
        URL_SET_ENABLED: 'eme_url_set_enabled',
        URL_ADD_URLS: 'eme_url_add_urls',
        URL_REMOVE_URLS: 'eme_url_remove_urls',
        SET_SHOW_INFO: 'eme_set_show_info',
        URL_GET_DATA: 'eme_url_get_data',
        ADD_URL: 'eme_add_url',
        URL_SET_ENABLED_LITE: 'eme_url_set_enabled_lite',
        EXPORT: 'eme_export',
        IMPORT: 'eme_import',
        URL_ASK_QUESTION: 'eme_url_question',
    },
    DB: {
        URL_ENABLED: 'eme_url_enabled',
        URL_TYPE: 'eme_url_type',
        URL_LIST: 'eme_url_list',
        SHOW_INFO: 'eme_show_info',
        BLOCKS: 'eme_blocks',
        CHECKS: 'eme_checks'
    },
    REMOTE: {
        URL: REMOTE.URL + 'emergents/',
        URL_DEFAULT: REMOTE.URL + 'default/emergents/'
    },
    ALIAS: 'eme'
}

const POP_UP = {
    REQUEST: {
        SHOW_INFO: 'pop_up_show_info',
        SHOW_ERROR: 'pop_up_show_error',
        SHOW_ASK: 'pop_up_show_ask'
    },
    ALIAS: 'pop_up'
}

const LOGGER = {
    REQUEST: {
        LAST_ROWS: 'log_get_last_rows'
    },
    N_ROWS: 30,
    MAX_ROWS: 10000,
    DB: {
        LOG: 'logger_msg',
        LOG_DEV: 'logger_dev'
    },
    REMOTE: {
        URL_POST: REMOTE.URL + 'log/'
    }
}

const SUPER = {
    REQUEST: {
        GET_DATA: 'sp_get_data',
        LOGIN: 'sp_login',
        LOGOUT: 'sp_logout',
        SET_ENABLED: 'sp_set_enabled',
        CHANGE_PSW: 'sp_set_psw'
    },
    MAX_TIME: 90,
    DB: {
        ENABLED: 'sp_enabled',
        PSW: 'sp_psw'
    },
    ALIAS: 'sp'
}

const TYPE = {
    WHITELIST: 0,
    BLACKLIST: 1
}

const CONTROLLER = {
    REQUEST: {
        GET_DATA: 'ctr_get_data',
        EXPORT: 'ctr_export'
    }
}

const IMPORT = {
    REMOTE: {
        URL_IMPORT: REMOTE.URL + 'default/'
    }
}

const get_dict_values = function(a) {
    return Object.keys(a).map(function(key) {
        return a[key];
    });
}