var sp_charged = false;
var sp_section = 'sp';

var init_super = function() {
    getMessage("super_tab", "super-tab");

}

var show_super = function() {
    if (!sp_charged) {
        init_sp_components();
        sp_charged = true;
    }
    sp_load_all();

}

function init_sp_components() {

    var col = create_elem('div', {
        classList: ['col']
    });

    var row = create_elem('div', {
        classList: ['row'],
        children: [col]
    });

    add_card(sp_section, 1, col);

    $('#' + sp_section + '-container').append(row);

    var enabled_check = create_checkbox(sp_section, 'enabled', 1, ['custom-checkbox']);

    $('#' + sp_section + '-header-1').html(enabled_check);
    $('#' + sp_section + '-enabled-label-1').html('DESU');
    $('#' + sp_section + '-title-1').html('Holi :)');
    $('#' + sp_section + '-enabled-1').change(save_sp_enabled);
}

function sp_load_all() {

}

function sp_show(data) {


}

function save_sp_enabled() {

}