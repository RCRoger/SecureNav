function DownloadController() {
  this.section = 'dwl';
  this.charged = false;
};

(function (DC, undef) {

  DC.prototype.show_download = function () {
    if (!this.charged)
      this.init_urlist_components();
    this.show_ip_list();
  }

  DC.prototype.init_download = function () {
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

  function send_urls(data){
    chrome.extension.sendRequest({ id: "dwl_url_add_urls", data: data });
  }

  DC.prototype.show_ip_list = function () {

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

      var add_btn = document.createElement('span');
      add_btn.id = 'dwl_url_add';
      add_btn.classList.add('table-add', 'float-right', 'mt-2', 'mb-6', 'mr-2');

      var a = document.createElement('a');
      a.classList.add('text-success');
      var icon = document.createElement('i');
      icon.classList.add('fas', 'fa-plus', 'fa-2x');
      a.appendChild(icon);
      add_btn.appendChild(a);

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

      $('#dwl_url_add').click(addRows);
    });
  }

  function addRows() {

    var headers = ['Protocol', 'Domain', 'Page']

    var id = 'dwl' + '-url-add';
    var modal = create_modal_large(id);
    var edit_table = create_editable_table(id + '-table', headers);

    $(document.body).append(modal);

    var save_btn = document.createElement('span');
    save_btn.id = 'dwl_url_save';
    save_btn.classList.add('float-right', 'mt-2', 'mb-6', 'mr-2');

    var a = document.createElement('a');
    a.classList.add('text-primary');
    var icon = document.createElement('i');
    icon.classList.add('far', 'fa-save', 'fa-2x');
    a.appendChild(icon);
    save_btn.appendChild(a);

    $('#' + id + '-header').append(save_btn);

    $('#' + id + '-body').append(edit_table);

    $('#' + id).on('hide.bs.modal', function () {
      $('#' + id).remove();
    });

    $("#" + id + '-table tr td:eq(1)').focusout(function () {
      if (this.innerHTML.length > 0) {
        add_rows_edit($("#" + id + '-table'));
      }
    });

    $('#' + save_btn.id).click(function(){
      var tr = $('#' + edit_table.id).find('tbody tr');

      var data = [];
      tr.each(function() {
        var tds = $(this).find('td');
        var item = {}
        if(tds[1].innerHTML.length > 0){
            item['host'] = tds[1].innerHTML;
            item['protocol'] = tds[0].innerHTML.length <= 0 ? '*' : tds[0].innerHTML;
            item['page'] = tds[2].innerHTML.length <= 0 ? '*' : tds[2].innerHTML;
            data.push(item);
        }

      });
      send_urls(data);
      $('#' + id).modal('hide');
    });
    $('#' + id).modal('show');





  }

  DC.prototype.init_urlist_components = function () {
    this.charged = true;
    add_card(this.section, 1);
    var enabled_check = create_checkbox(this.section, 'enabled', 1, ['custom-checkbox']);
    $('#dwl-header-1').html(enabled_check);
    $('#dwl-enabled-1').change(save_enabled);


    var a = document.createElement('a');
    a.classList.add('float-left');
    a.id = "dwl-title-a-1";
    $('#dwl-title-1').append(a);
    getMessage("dwl_title", "dwl-title-a-1");

    var switch_check = create_checkbox(this.section, 'switch', 1, ['custom-switch', 'float-right']);
    $('#dwl-title-1').append(switch_check);
    $('#dwl-switch-1').change(save_type);

  }
})(DownloadController);
