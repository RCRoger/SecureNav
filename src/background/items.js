function item_lite(db, show_info = true, blocks = 0, checks = 0) {
    var ret = {};
    ret[db.DB.SHOW_INFO] = show_info;
    ret[db.DB.CHECKS] = checks;
    ret[db.DB.BLOCKS] = blocks;
    return ret;
}