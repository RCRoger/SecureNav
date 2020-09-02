var sp_charged = false;
var sp_section = 'sp';

var init_super = function() {
    getMessage("super_tab", "super-tab");

}

var show_super = function(lite = false) {
    if (!sp_charged) {
        init_sp_components(lite);
        sp_charged = true;
    }
    sp_load_all();

}

function init_sp_components(lite = false) {
    let col_params = { classList: ['col'] }
    var col = create_elem('div', col_params);
    var children = [col];
    if (!lite) {
        var col2 = create_elem('div', col_params);
        add_card(sp_section, 2, col2);
        children.push(col2);
    }

    var row = create_elem('div', {
        classList: ['row'],
        children: children
    });

    add_card(sp_section, 1, col);


    $('#' + sp_section + '-container').append(row);

    var enabled_check = create_checkbox(sp_section, 'enabled', 1, ['custom-checkbox']);
    var footer = create_elem('div', { classList: ['card-footer', 'text-center'] });
    footer.id = sp_section + '-footer-1';

    $('#' + sp_section + '-card-1').append(footer);
    $('#' + sp_section + '-header-1').html(enabled_check);

    $('#' + sp_section + '-enabled-1').change(save_sp_enabled);

    if (!lite) {

        $('#' + sp_section + '-header-2').html(getMessageStr('description'));
        $('#' + sp_section + '-title-2').remove();
        $('#' + sp_section + '-text-2').html(getMessageStr('sp_description'));
    }
}

function sp_load_all() {
    chrome.runtime.sendMessage(chrome.runtime.id, { id: SUPER.REQUEST.GET_DATA }, sp_show_all);
}

function sp_show_all(data) {
    sp_show_enabled(data);
    sp_show_logins(data);
}

function sp_show_logins(data) {
    if (!data.hasHash) {

        var group1 = create_input_group();
        group1.classList.add('mb-5');
        var pre1 = add_group_prepend(group1);

        var text1 = getMessageStr('password');

        var val1 = add_prepend_text(pre1, text1);

        var psw1 = add_group_input(sp_section + '-password-1', group1, 'password');
        psw1.placeholder = getMessageStr('password');

        var group2 = create_input_group();
        group2.classList.add('mb-5');

        var pre2 = add_group_prepend(group2);

        var text2 = getMessageStr('password');

        var val2 = add_prepend_text(pre2, text2);

        var psw2 = add_group_input(sp_section + '-password-2', group2, 'password');
        psw2.placeholder = getMessageStr('repeat_password');


        $('#' + sp_section + '-text-1').html([group1, group2]);
        $('#' + sp_section + '-title-1').html(getMessageStr('sp_singup_title'));
        $('#' + sp_section + '-footer-1').html(create_button(sp_section + '-singup-btn', {
            classList: ['btn-md', 'btn-default'],
            innerHTML: getMessageStr('sp_singup')
        }));
        $('#' + sp_section + '-singup-btn').click(singup);

    } else if (data.logged) {


        var group1 = create_input_group();
        group1.classList.add('mb-5');
        var pre1 = add_group_prepend(group1);

        var text1 = getMessageStr('password');

        var val1 = add_prepend_text(pre1, text1);

        var psw1 = add_group_input(sp_section + '-password-1', group1, 'password');
        psw1.placeholder = getMessageStr('sp_old_pwd');

        var group2 = create_input_group();
        group2.classList.add('mb-5');

        var pre2 = add_group_prepend(group2);

        var text2 = getMessageStr('password');

        var val2 = add_prepend_text(pre2, text2);
        val2.title = getMessageStr('sp_pwd_minims');

        var psw2 = add_group_input(sp_section + '-password-2', group2, 'password');
        psw2.placeholder = getMessageStr('sp_new_pwd');

        var group3 = create_input_group();
        group3.classList.add('mb-5');
        var pre3 = add_group_prepend(group3);

        var text3 = getMessageStr('password');

        var val3 = add_prepend_text(pre3, text3);
        val3.title = getMessageStr('sp_pwd_minims');

        var psw3 = add_group_input(sp_section + '-password-3', group3, 'password');
        psw3.placeholder = getMessageStr('repeat_password');

        var logout_btn = create_button(sp_section + '-logout-btn', {
            classList: ['btn-md', 'btn-default'],
            innerHTML: getMessageStr('sp_logout')
        });

        var change_btn = create_button(sp_section + '-change-btn', {
            classList: ['btn-md', 'btn-default'],
            innerHTML: getMessageStr('sp_change')
        });

        $('#' + sp_section + '-title-1').html(getMessageStr('sp_logged'));
        $('#' + sp_section + '-text-1').html([group1, group2, group3]);
        $('#' + sp_section + '-footer-1').html([change_btn, logout_btn]);
        $('#' + sp_section + '-logout-btn').click(logout);
        $('#' + sp_section + '-change-btn').click(change);
        $('#' + sp_section + '-card-1 span').tooltip();
    } else {
        var group1 = create_input_group();
        group1.classList.add('mb-5');
        var pre1 = add_group_prepend(group1);

        var text1 = getMessageStr('password');

        var val1 = add_prepend_text(pre1, text1);

        var psw1 = add_group_input(sp_section + '-password-1', group1, 'password');
        psw1.placeholder = getMessageStr('password');

        $('#' + sp_section + '-text-1').html(group1);
        $('#' + sp_section + '-title-1').html(getMessageStr('sp_login_title'));
        $('#' + sp_section + '-footer-1').html(create_button(sp_section + '-login-btn', {
            classList: ['btn-md', 'btn-default'],
            innerHTML: getMessageStr('sp_login')
        }));
        $('#' + sp_section + '-login-btn').click(login);
    }
}

function singup() {
    let pwd = $('#' + sp_section + '-password-1').val();
    let pwd1 = $('#' + sp_section + '-password-2').val();
    if (validate_pwd(pwd, pwd1))
        chrome.runtime.sendMessage(chrome.runtime.id, { id: SUPER.REQUEST.CHANGE_PSW, data: { new: pwd } }, sp_show_logins);
}

function change() {
    let pwd = $('#' + sp_section + '-password-1').val();
    let pwd1 = $('#' + sp_section + '-password-2').val();
    let pwd2 = $('#' + sp_section + '-password-3').val()
    if (validate_pwd(pwd1, pwd2))
        chrome.runtime.sendMessage(chrome.runtime.id, { id: SUPER.REQUEST.CHANGE_PSW, data: { old: pwd, new: pwd1 } }, sp_show_logins);
}

function login() {
    chrome.runtime.sendMessage(chrome.runtime.id, { id: SUPER.REQUEST.LOGIN, data: $('#' + sp_section + '-password-1').val() }, sp_show_logins);
}

function logout() {
    chrome.runtime.sendMessage(chrome.runtime.id, { id: SUPER.REQUEST.LOGOUT }, sp_show_logins);
}

function sp_show_enabled(data) {
    $('#' + sp_section + '-enabled-1').prop('checked', data.enabled);

    getMessage(data.enabled ? "enabled" : "disabled", sp_section + "-enabled-label-1");

}

function save_sp_enabled() {

    chrome.runtime.sendMessage(chrome.runtime.id, { id: SUPER.REQUEST.SET_ENABLED, data: this.checked }, sp_show_all);

}

function validate_pwd(pwd, pwd1) {
    let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,} /;
    if (pwd == pwd1 && reg.exec(pwd))
        return true;
    popUpController.create_error_msg('sp_pwd_invalid');
    return false;
}