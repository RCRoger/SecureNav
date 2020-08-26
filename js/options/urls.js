var that = undefined;

function UrlCardController(section, dB) {
    this.section = section;
    this.charged = false;
    this.dB = dB;
    that = this;
}

(function(UCC, undefined) {
    UCC.prototype.show = function(data) {
        if (this instanceof UrlCardController) {
            that = this;
        }
        $('#' + that.section + '-enabled-1').prop('checked', data.urls.enabled);

        getMessage(data.urls.enabled ? "enabled" : "disabled", that.section + "-enabled-label-1");

        if (data.urls.type == 0)
            $('#' + that.section + '-switch-1').prop('checked', true);
        else if (data.urls.type == 1)
            $('#' + that.section + '-switch-1').prop('checked', false);
        getMessage($('#' + that.section + '-switch-1').is(':checked') ? "whiteList" : "blackList", that.section + "-switch-label-1");



        var headers = ['pos', 'scheme', 'host', 'path'];
        var id = that.section + '-table-1';
        var rows = [];
        var i = 0;
        data.urls.urls.forEach((item) => {
            rows.push([i++, item.protocol, item.host, item.page]);
        });
        var tbl = create_table(id, headers, rows);

        var add_btn = create_add_btn(that.section + '_url_add');

        var div = document.createElement('div');
        div.appendChild(add_btn);
        div.appendChild(tbl);

        $('#' + that.section + '-text-1').html(div);
        $('#' + that.section + '-table-1').dataTable({
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
        $('#' + that.section + '-table-1').find('th').removeClass('select-checkbox select-checkbox-all');
        that.show_url_events();

    }

    UCC.prototype.trash_event = function() {
        $('#' + this.section + '-table-1-trash').click(this.trash_action);
    }

    UCC.prototype.trash_action = function() {
        var rows_selected = $('#' + that.section + '-table-1 tbody .selected');
        var data = { data: [] };
        rows_selected.each(function() {
            data.data.push($(this.childNodes[1]).text());
            $(this).remove();
        });
        that.send_urls_remove(data);
    }

    UCC.prototype.addRows = function() {

        var headers = ['scheme', 'host', 'page'];

        var id = this.section + '' + '-url-add';
        var table_id = id + '-table';
        var save_id = id + '-save';
        var modal = create_modal_large(id);
        var edit_table = create_editable_table(table_id, headers);

        $(document.body).append(modal);

        var save_btn = create_save_btn(save_id);

        $('#' + id + '-header').append(save_btn);

        $('#' + id + '-body').append(edit_table);


        $('#' + id).modal('show');

        that.add_rows_events(id, table_id, save_id);
    }


    UCC.prototype.add_rows_events = function(id, table_id, save_id) {
        $('#' + id).on('hide.bs.modal', function() {
            $('#' + id).remove();
        });

        $("#" + table_id + ' tr td:eq(1)').focusout(function() {
            if (this.innerHTML.length > 0) {
                add_rows_edit($("#" + table_id));
            }
        });

        $('#' + save_id).click(function() {
            var tr = $("#" + table_id).find('tbody tr');

            var data = [];
            tr.each(function() {
                var tds = $(this).find('td');
                var item = {}
                if (tds[1].innerHTML.length > 0) {
                    item['host'] = tds[1].innerHTML;
                    item['protocol'] = tds[0].innerHTML.length <= 0 ? '*' : tds[0].innerHTML;
                    item['page'] = tds[2].innerHTML.length <= 0 ? '*' : tds[2].innerHTML;
                    data.push(item);
                }

            });
            that.send_urls_add(data);
            $('#' + id).modal('hide');
        });
    }

    UCC.prototype.init_components = function() {
        if (this.charged)
            return;
        this.charged = true;
        that = this;
        add_card(this.section, 1);
        var enabled_check = create_checkbox(this.section, 'enabled', 1, ['custom-checkbox']);
        $('#' + this.section + '-header-1').html(enabled_check);
        $('#' + this.section + '-enabled-1').change(this.save_url_enabled);


        var a = document.createElement('a');
        a.classList.add('float-left');
        a.id = this.section + "-title-a-1";
        $('#' + this.section + '-title-1').append(a);
        getMessage("url_title", this.section + "-title-a-1");

        var switch_check = create_checkbox(this.section, 'switch', 1, ['custom-switch', 'float-right']);
        $('#' + this.section + '-title-1').append(switch_check);
        $('#' + this.section + '-switch-1').change(this.save_type);

    }

    UCC.prototype.show_url_events = function() {
        $('#' + this.section + '_url_add').click(this.addRows);
        $('#' + this.section + '-table-1 .select-checkbox').click(function() {
            var rows_selected = $('#' + that.section + '-table-1 tbody .selected');
            if (rows_selected.length == 0) {
                $('#' + that.section + '-text-1').first().prepend(create_trash_btn(that.section + '-table-1-trash'));
                that.trash_event();
            } else if (rows_selected.length == 1 && $(this).parent().hasClass('selected')) {
                $('#' + that.section + '-table-1-trash').remove();
            }
        });

        $('#' + this.section + '-text-1 thead .select-checkbox-all').click(function() {
            var rows_selected = $('#' + that.section + '-table-1 tbody .selected');
            var rows = $('#' + that.section + '-table-1 tbody tr');
            if (rows_selected.length == rows.length) {
                $('#' + that.section + '-table-1-trash').remove();
            } else if ($('#' + that.section + '-table-1-trash').length == 0) {
                $('#' + that.section + '-text-1').first().prepend(create_trash_btn(that.section + '-table-1-trash'));
                that.trash_event();
            }
        });

    }

    UCC.prototype.save_url_enabled = function() {
        getMessage(this.checked ? "enabled" : "disabled", that.section + "-enabled-label-1");
        chrome.runtime.sendMessage(chrome.runtime.id, { id: that.dB.REQUEST.URL_SET_ENABLED, data: this.checked });
    }



    UCC.prototype.send_urls_add = function(data) {
        chrome.runtime.sendMessage(chrome.runtime.id, { id: that.dB.REQUEST.URL_ADD_URLS, data: data }, this.show_url);
    }

    UCC.prototype.send_urls_remove = function(data) {
        chrome.runtime.sendMessage(chrome.runtime.id, { id: that.dB.REQUEST.URL_REMOVE_URLS, data: data }, this.show_url);
    }

    UCC.prototype.save_type = function() {
        getMessage(this.checked ? "whiteList" : "blackList", that.section + "-switch-label-1");
        var type = undefined;
        if (this.checked)
            type = 0;
        else
            type = 1;

        chrome.runtime.sendMessage(chrome.runtime.id, { id: that.dB.REQUEST.URL_SET_TYPE, data: type });
    }


})(UrlCardController);