
const section = 'dwl';
var charged = false;

function init_download(){
  getMessage("download_tab", "download-tab");
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        if(e.target.id == 'download-tab')
            show_download();
        });
}


function save_type(){
  getMessage(this.checked ? "whiteList" : "blackList", "dwl-switch-label-1");
  var type = undefined;
  if(this.checked)
    type = 0;
  else
    type = 1;
  chrome.storage.local.set({
    'dwl_type': type 
  }, update_dwl_background);
}

function save_enabled(){
  getMessage(this.checked ? "enabled" : "disabled", "dwl-enabled-label-1");
  chrome.storage.local.set({
    'dwl_enabled': this.checked 
  }, update_dwl_background);
}

function show_ip_list(){

  chrome.storage.local.get(['dwl_enabled','dwl_url_list', 'dwl_type'], function(data){

    $('#dwl-enabled-1').prop('checked', data.dwl_enabled);

    getMessage(data.dwl_enabled ? "enabled" : "disabled", "dwl-enabled-label-1");

    if(data.dwl_type == 0)
      $('#dwl-switch-1').prop('checked', true);
    else if (data.dwl_type == 1)
      $('#dwl-switch-1').prop('checked', false);
    getMessage($('#dwl-switch-1').is(':checked') ? "whiteList" : "blackList", "dwl-switch-label-1");



    var headers = ['Protocol', 'Domain', 'Page']
    var id = 'dwl-table-1'
    var rows = [];
    data.dwl_url_list.forEach((item) => {
        rows.push([item.protocol, item.host, item.page]);
    });
    var tbl = create_table(id, headers, rows);

    var edit_btn = document.createElement('span');
    edit_btn.classList.add('table-add', 'float-right', 'mt-2', 'mb-3', 'mr-2');

    var a = document.createElement('a');
    a.classList.add('text-success');
    var icon = document.createElement('i');
    icon.classList.add('fas', 'fa-plus', 'fa-2x');
    a.appendChild(icon);
    edit_btn.appendChild(a);

    var div = document.createElement('div');
    div.appendChild(edit_btn);
    div.appendChild(tbl);

    $('#dwl-text-1').html(div);
    $('#dwl-table-1').dataTable({
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
  });
}


function show_download(){
  if(!charged)
    init_urlist_components();
  show_ip_list();
}

function init_urlist_components(){
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

function update_dwl_background(){
  chrome.extension.sendRequest({id:"update_dwl"});
}