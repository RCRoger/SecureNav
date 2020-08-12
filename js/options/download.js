function init_download(){
    getMessage("download_tab", "download-tab");
    getMessage("dwl_title", "dwl-title-1");

    $('#dwl-switch-1').change(save_type);

    $('#dwl-enabled-1').change(save_enabled);
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        if(e.target.id == 'download-tab')
            show_download();
        });
}


function save_type(){
  $('#dwl-switch-label-1').text(this.checked ? "WhiteList" : "BlackList");
  var type = undefined;
  if(this.checked)
    type = 0;
  else
    type = 1;
  chrome.storage.local.set({
    'dwl_type': type 
  });
}

function save_enabled(){
  $('#dwl-enabled-label-1').text(this.checked ? "Habilitat" : "Deshabilitat");
  var enabled = undefined;
  chrome.storage.local.set({
    'dwl_enabled': this.checked 
  });
}

function show_ip_list(){

  chrome.storage.local.get(['dwl_enabled','dwl_url_list', 'dwl_type'], function(data){

    $('#dwl-enabled-1').prop('checked', data.dwl_enabled);

    if(data.dwl_type == 0)
      $('#dwl-switch-1').prop('checked', true);
    else if (data.dwl_type == 1)
      $('#dwl-switch-1').prop('checked', false);
    $('#dwl-switch-label-1').text($('#dwl-switch-1').is(':checked') ? "WhiteList" : "BlackList");



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
    show_ip_list();
}