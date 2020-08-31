var eme_charged = false;
var eme_section = 'eme';

var eme_url = new UrlCardController(eme_section, EMERGENT);
var eme_not = new NotiCardController(eme_section, EMERGENT, 2);
var eme_exp = new ExportCardController(eme_section, EMERGENT, 3);
var eme_imp = new ImportCardController(eme_section, EMERGENT, 4, eme_show_all);


var init_pages = function() {
    getMessage("popup", "popup-tab");

}

var show_emergent = function() {
    if (!eme_charged) {
        eme_url.init_components();
        init_eme_components();
        eme_not.init_components('#eme-col-not');
        eme_exp.init_components('#eme-col-exp');
        eme_imp.init_components('#eme-col-imp');
        eme_visual_fixes();
        eme_charged = true;
    }
    eme_load_all();

}

function eme_import_data(data, file, override) {
    eme_url.import_urls(data, file, override);
}

function eme_load_all() {
    chrome.runtime.sendMessage(chrome.runtime.id, { id: EMERGENT.REQUEST.GET_DATA }, eme_show_all);
}

function eme_show_all(data) {
    eme_url.show(data);
    eme_not.show(data);
}

var init_eme_components = function() {
    var div_params = {
        classList: ['row', 'row-cols-3']
    };

    var col_params = { classList: ['col'] };

    var div = create_elem('div', div_params);
    div.id = 'eme-row-2';

    var col1 = create_elem('div', col_params);
    col1.id = 'eme-col-not';
    div.appendChild(col1);

    var col2 = create_elem('div', col_params);
    col2.id = 'eme-col-exp';
    div.appendChild(col2);

    var col3 = create_elem('div', col_params);
    col3.id = 'eme-col-imp';
    div.appendChild(col3);

    $('#' + eme_section + '-container').append(div);
}

function eme_visual_fixes() {
    $('#eme-card-2 .card-body').css('min-height', '186px');
}