function init_download(){
    getMessage("download_tab", "download-tab");
    getMessage("dwl_title", "dwl-title-1");

    $('#dwl-switch-1').change(save_type);

    
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        if(e.target.id == 'download-tab')
            show_download();
        });
}


function save_type(){
  $('#dwl-label-1').text(this.checked ? "WhiteList" : "BlackList");
  var type = undefined;
  if(this.checked)
    type = 0;
  else
    type = 1;
  chrome.storage.local.set({
    'dwl_type': type 
  });
}

function show_ip_list(){

  chrome.storage.local.get('dwl_type', function(data){
    if(data.dwl_type == 0)
      $('#dwl-switch-1').prop('checked', true);
    else if (data.dwl_type == 1)
      $('#dwl-switch-1').prop('checked', false);
    $('#dwl-label-1').text($('#dwl-switch-1').is(':checked') ? "WhiteList" : "BlackList");
  });

  chrome.storage.local.get('dwl_url_list', function(data){
    var headers = ['Protocol', 'SubDomain', 'Domain', 'Page']
    var id = 'dwl-table-1'
    var rows = [];
    data.dwl_url_list.forEach((item) => {
        rows.push([item.protocol, item.host, item.host, item.page]);
    });
    var tbl = create_table(id, headers, rows);
    $('#dwl-text-1').html(tbl);
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