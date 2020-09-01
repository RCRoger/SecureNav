function super_item(enabled = false, password = undefined) {
    let ret = {};
    ret[SUPER.DB.ENABLED] = enabled;
    ret[SUPER.DB.PSW] = password;
    return ret;
}