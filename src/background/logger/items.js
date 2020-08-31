function logger_item(def = '', dev = '') {
    var ret = {};

    ret[LOGGER.DB.LOG] = def;
    ret[LOGGER.DB.LOG_DEV] = dev;
    return ret;
}