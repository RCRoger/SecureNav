var pg_charged = false;
var pg_section = 'pg';

var pg_url = new UrlCardController(pg_section, PAGE);
var pg_not = new NotiCardController(pg_section, PAGE, 2);
var pg_exp = new ExportCardController(pg_section, PAGE, 3);
var pg_imp = new ImportCardController(pg_section, PAGE, 4);


var init_pages = function() {
    getMessage("sites_tab", "sites-tab");

}

var show_page = function() {
    if (!pg_charged) {
        pg_url.init_components();
        init_pg_components();
        pg_not.init_components('#pg-col-not');
        pg_exp.init_components('#pg-col-exp');
        pg_imp.init_components(pg_import_data, '#pg-col-imp');
        pg_charged = true;
    }
    pg_load_all();

}

function pg_import_data(data, file, override) {
    pg_url.import_urls(data, file, override);
}

function pg_load_all() {
    chrome.runtime.sendMessage(chrome.runtime.id, { id: PAGE.REQUEST.GET_DATA }, pg_show_all);
}

function pg_show_all(data) {
    pg_url.show(data);
    pg_not.show(data);
}

var init_pg_components = function() {
    var div_params = {
        classList: ['row', 'row-cols-3']
    };

    var col_params = { classList: ['col'] };

    var div = create_elem('div', div_params);
    div.id = 'pg-row-2';

    var col1 = create_elem('div', col_params);
    col1.id = 'pg-col-not';
    div.appendChild(col1);

    var col2 = create_elem('div', col_params);
    col2.id = 'pg-col-exp';
    div.appendChild(col2);

    var col3 = create_elem('div', col_params);
    col3.id = 'pg-col-imp';
    div.appendChild(col3);

    $('#' + pg_section + '-container').append(div);

}