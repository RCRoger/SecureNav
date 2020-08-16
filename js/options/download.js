
var section = 'dwl';
var charged = false;


var show_download = function () {
  if (!charged)
    init_urlist_components();
  show_url();
}

var init_download = function () {
  getMessage("download_tab", "download-tab");
  var that = this;
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if (e.target.id == 'download-tab')
      that.show_download();
  });
}


function save_type() {
  getMessage(this.checked ? "whiteList" : "blackList", "dwl-switch-label-1");
  var type = undefined;
  if (this.checked)
    type = 0;
  else
    type = 1;

  chrome.extension.sendRequest({ id: "dwl_url_set_type", data: type });
}

function save_enabled() {
  getMessage(this.checked ? "enabled" : "disabled", "dwl-enabled-label-1");
  chrome.extension.sendRequest({ id: "dwl_url_set_enabled", data: this.checked });
}

function send_urls_add(data) {
  chrome.extension.sendRequest({ id: "dwl_url_add_urls", data: data },show_url);
}

function send_urls_remove(data) {
  chrome.extension.sendRequest({ id: "dwl_url_remove_urls", data: data, 'update': show_url });
}

var show_url = function () {

  chrome.storage.local.get(['dwl_url_enabled', 'dwl_url_list', 'dwl_url_type'], function (data) {

    $('#dwl-enabled-1').prop('checked', data.dwl_url_enabled);

    getMessage(data.dwl_url_enabled ? "enabled" : "disabled", "dwl-enabled-label-1");

    if (data.dwl_url_type == 0)
      $('#dwl-switch-1').prop('checked', true);
    else if (data.dwl_url_type == 1)
      $('#dwl-switch-1').prop('checked', false);
    getMessage($('#dwl-switch-1').is(':checked') ? "whiteList" : "blackList", "dwl-switch-label-1");



    var headers = ['Id', 'Protocol', 'Domain', 'Page'];
    var id = 'dwl-table-1';
    var rows = [];
    var i = 0;
    data.dwl_url_list.forEach((item) => {
      rows.push([i++, item.protocol, item.host, item.page]);
    });
    var tbl = create_table(id, headers, rows);

    var add_btn = create_add_btn('dwl_url_add');

    var div = document.createElement('div');
    div.appendChild(add_btn);
    div.appendChild(tbl);

    $('#dwl-text-1').html(div);
    $('#dwl-table-1').dataTable({
      "ordering": false,
      "scrollY": "300px",
      "scrollCollapse": true,
      "paging": false,
      columnDefs: [{
        orderable: false,
        className: 'select-checkbox select-checkbox-all',
        targets: 0
      }],
      select: {
        style: 'multi',
        selector: 'td:first-child'
      }
    });
    //FIX visual bug;
    $('#dwl-table-1').find('th').removeClass('select-checkbox select-checkbox-all');
    show_url_events();

  });
}

function show_url_events() {
  $('#dwl_url_add').click(addRows);
  $('#dwl-table-1 .select-checkbox').click(function () {
    var rows_selected = $('#dwl-table-1 tbody .selected');
    if (rows_selected.length == 0) {
      $('#dwl-text-1').first().prepend(create_trash_btn('dwl-table-1-trash'));
      trash_event();
    }
    else if (rows_selected.length == 1 && $(this).parent().hasClass('selected')) {
      $('#dwl-table-1-trash').remove();
    }
  });

  $('#dwl-text-1 thead .select-checkbox-all').click(function () {
    var rows_selected = $('#dwl-table-1 tbody .selected');
    var rows = $('#dwl-table-1 tbody tr');
    if (rows_selected.length == rows.length) {
      $('#dwl-table-1-trash').remove();
    }
    else {
      $('#dwl-text-1').first().prepend(create_trash_btn('dwl-table-1-trash'));
      trash_event();
    }
  });

}

function trash_event(){
  $('#dwl-table-1-trash').click(trash_action);
}

function trash_action(){
  var rows_selected = $('#dwl-table-1 tbody .selected');
  var data = { data : [], update: show_url};
  rows_selected.each(function(){
    data.data.push($(this.childNodes[1]).text());
    $(this).remove();
  });
  send_urls_remove(data);
}

function addRows() {

  var headers = ['Protocol', 'Domain', 'Page'];

  var id = 'dwl' + '-url-add';
  var table_id = id + '-table';
  var save_id = id + '-save';
  var modal = create_modal_large(id);
  var edit_table = create_editable_table(table_id, headers);

  $(document.body).append(modal);

  var save_btn = create_save_btn(save_id);

  $('#' + id + '-header').append(save_btn);

  $('#' + id + '-body').append(edit_table);


  $('#' + id).modal('show');

  add_rows_events(id, table_id, save_id);
}


function add_rows_events(id, table_id, save_id) {
  $('#' + id).on('hide.bs.modal', function () {
    $('#' + id).remove();
  });

  $("#" + table_id + ' tr td:eq(1)').focusout(function () {
    if (this.innerHTML.length > 0) {
      add_rows_edit($("#" + table_id));
    }
  });

  $('#' + save_id).click(function () {
    var tr = $("#" + table_id).find('tbody tr');

    var data = [];
    tr.each(function () {
      var tds = $(this).find('td');
      var item = {}
      if (tds[1].innerHTML.length > 0) {
        item['host'] = tds[1].innerHTML;
        item['protocol'] = tds[0].innerHTML.length <= 0 ? '*' : tds[0].innerHTML;
        item['page'] = tds[2].innerHTML.length <= 0 ? '*' : tds[2].innerHTML;
        data.push(item);
      }

    });
    send_urls_add(data);
    $('#' + id).modal('hide');
  });
}

var init_urlist_components = function () {
  charged = true;
  add_card(section, 1);
  var enabled_check = create_checkbox(section, 'enabled', 1, ['custom-checkbox']);
  $('#dwl-header-1').html(enabled_check);
  $('#dwl-enabled-1').change(save_enabled);


  var a = document.createElement('a');
  a.classList.add('float-left');
  a.id = "dwl-title-a-1";
  $('#dwl-title-1').append(a);
  getMessage("dwl_title", "dwl-title-a-1");

  var switch_check = create_checkbox(section, 'switch', 1, ['custom-switch', 'float-right']);
  $('#dwl-title-1').append(switch_check);
  $('#dwl-switch-1').change(save_type);

}
