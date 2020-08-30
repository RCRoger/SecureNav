var dwl_section = 'dwl';
var charged = false;
var dwl_url = new UrlCardController(dwl_section, DOWNLOAD);
var dwl_not = new NotiCardController(dwl_section, DOWNLOAD, 3);
var dwl_exp = new ExportCardController(dwl_section, DOWNLOAD, 4);
var dwl_imp = new ImportCardController(dwl_section, DOWNLOAD, 5, show_all);

var show_download = function() {
    if (!charged) {
        dwl_url.init_components();
        init_dwl_components();
        init_urlsize_components();
        dwl_not.init_components('#dwl-col-not');
        dwl_exp.init_components('#dwl-col-exp');
        dwl_imp.init_components('#dwl-col-imp');

    }
    load_all();

}

var init_download = function() {
    getMessage("download_tab", "download-tab");

}

function dwl_import_data(data, file, override) {
    dwl_url.import_urls(data, file, override);
}

function load_all() {
    chrome.runtime.sendMessage(chrome.runtime.id, { id: DOWNLOAD.REQUEST.GET_DATA }, show_all);
}

var save_size_val = function(data) {
    chrome.runtime.sendMessage(chrome.runtime.id, { id: DOWNLOAD.REQUEST.SIZE_SET_VAL, data: data });
}

var save_size_enabled = function() {
    getMessage(this.checked ? "enabled" : "disabled", dwl_section + "-enabled-label-2");
    chrome.runtime.sendMessage(chrome.runtime.id, { id: DOWNLOAD.REQUEST.SIZE_SET_ENABLED, data: this.checked });
}

var init_dwl_components = function() {
    var div_params = {
        classList: ['row', 'row-cols-2']
    }

    var col_params = {
        classList: ['col']
    }
    var div = create_elem('div', div_params);
    div.id = 'dwl-row-2';

    var col = create_elem('div', col_params);
    col.id = 'dwl-col-size';
    div.appendChild(col);

    var col1 = create_elem('div', col_params);
    col1.id = 'dwl-col-not';
    div.appendChild(col1);

    var col2 = create_elem('div', col_params);
    col2.id = 'dwl-col-exp';
    div.appendChild(col2);

    var col3 = create_elem('div', col_params);
    col3.id = 'dwl-col-imp';
    div.appendChild(col3);

    $('#' + dwl_section + '-container').append(div);

}

var init_urlsize_components = function() {
    charged = true;
    const num = 2;
    add_card(dwl_section, num, '#dwl-col-size');
    var enabled_check = create_checkbox(dwl_section, 'enabled', num, ['custom-checkbox']);
    $('#' + dwl_section + '-header-' + num).html(enabled_check);
    $('#' + dwl_section + '-enabled-' + num).change(save_size_enabled);


    var a = document.createElement('a');
    a.classList.add('float-left');
    a.id = dwl_section + "-title-a-" + num;
    $('#' + dwl_section + '-title-' + num).append(a);
    getMessage(dwl_section + "_title_1", a.id);
}

function show_all(data) {
    dwl_url.show(data);
    show_size(data);
    dwl_not.show(data);

}
var show_size = function(data) {

    $('#' + dwl_section + '-enabled-2').prop('checked', data.max_size.enabled);

    getMessage(data.max_size.enabled ? "enabled" : "disabled", dwl_section + "-enabled-label-2");

    var group = create_input_group();

    var pre = add_group_prepend(group);

    var text = "";

    if (data.max_size.max_size)
        text = data.max_size.max_size;

    text += ' Bytes';

    var val = add_prepend_text(pre, text);

    val.id = dwl_section + '-max_size-value';

    var size = add_group_input(dwl_section + '-max_size-input', group, 'number');

    var bytes = create_select(dwl_section + '-bytes-input', ['B (Bytes)', 'KB (KiloBytes)', 'MB (MegaBytes)', 'GB (GigaByte)', 'TB (TeraBytes)'], [1, 1024, 1024 ** 2, 1024 ** 3, 1024 ** 4]);
    bytes.classList.add('form-control');
    group.appendChild(bytes);
    $('#' + dwl_section + '-text-2').html(group);

    $('#' + size.id).change(change_max_size);
    $('#' + bytes.id).change(change_max_size);

}

function change_max_size() {
    var val = $('#' + dwl_section + '-max_size-input').val();
    var convert = $('#' + dwl_section + '-bytes-input').children("option:selected").val();
    var final_value = (val.toString().length > 0 && convert) ? (val * convert) : '';
    var text = final_value + ' Bytes';
    $('#' + dwl_section + '-max_size-value').text(text);
    save_size_val(final_value);
}