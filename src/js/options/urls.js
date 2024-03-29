var that = undefined;

function UrlCardController(section, dB, filters = true) {
    this.section = section;
    this.charged = false;
    this.dB = dB;
    this.filters = filters;
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

        var table_settings = {
            "ordering": false,
            "scrollY": "300px",
            "scrollCollapse": true,
            "paging": false,
            "searching": false,
            columnDefs: [{
                orderable: false,
                className: 'select-checkbox select-checkbox-all',
                targets: 0
            }],
            select: {
                style: 'multi',
                selector: 'td:first-child'
            }
        };

        var headers = ['pos', 'scheme', 'host', 'path'];
        var id = that.section + '-table-1';
        var rows = [];
        var i = 0;
        data.urls.urls.forEach((item) => {
            rows.push([i++, item.protocol, item.host, item.page]);
        });
        var tbl = create_table(id, headers, rows);


        var div = document.createElement('div');
        //div.appendChild(add_btn);
        div.appendChild(tbl);

        $('#' + that.section + '-text-1').html(div);
        $('#' + that.section + '-table-1').dataTable(table_settings);
        //FIX visual bug;
        $('#' + that.section + '-table-1').find('th').removeClass('select-checkbox select-checkbox-all');
        that.show_url_events();

        if (that.filters) {
            for (let i = 0; i < REMOTE.FILTERS.length; i++) {
                const element = REMOTE.FILTERS[i];
                if (data.urls.urls_filters.includes(element)) {
                    $('#' + that.section + '-filter-' + i).prop('checked', true);
                }
            }
        }



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
        $(this).remove();
    }

    UCC.prototype.addRows = function() {

        var headers = ['scheme', 'host', 'page'];

        var id = that.section + '' + '-url-add';
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
            var cancel = false;
            var data = [];
            tr.each(function() {
                var tds = $(this).find('td');
                var item = {}
                if (tds[1].innerHTML.length > 0) {
                    item['host'] = tds[1].innerHTML;
                    item['protocol'] = tds[0].innerHTML.length <= 0 ? '*' : tds[0].innerHTML;
                    item['page'] = tds[2].innerHTML.length <= 0 ? '*' : tds[2].innerHTML;
                    if (!is_host_valid(item.host) || !is_scheme_valid(item.protocol)) {
                        cancel = true;
                        popUpController.create_error_msg('invalid_pattern');
                        return;
                    }
                    data.push(item);
                }

            });
            if (!cancel) {
                that.send_urls_add(data);
                $('#' + id).modal('hide');
            }
        });
    }

    UCC.prototype.save_filters = function() {
        that.send_filters($(this).val());
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

        var add_btn = create_add_btn(that.section + '_url_add');

        var switch_check = create_checkbox(this.section, 'switch', 1, ['custom-switch', 'float-right']);
        $('#' + this.section + '-title-1').append(add_btn, switch_check);
        $('#' + this.section + '-switch-1').change(this.save_type);
        $('#' + that.section + '-text-1').html(create_elem('div', {
            classList: ['spinner-border', 'text-primary']
        }));
        $('#' + this.section + '_url_add').click(this.addRows);
        if (this.filters) {
            add_card(this.section, 10);
            $('#' + this.section + '-header-10').html(getMessageStr('filters'));
            let items = [];
            let num = 0;
            REMOTE.FILTERS.forEach(i => {
                var check = create_checkbox(this.section, 'filter', num++, ['custom-checkbox']);
                $(check).find('input').change(this.save_filters);
                $(check).find('input').val(i);
                $(check).find('label').text(getMessageStr(i + '_filter'));
                items.push(create_elem('div', {
                    classList: ['col'],
                    children: [check],
                }));
                let row = create_elem('div', {
                    classList: ['row'],
                    children: items
                });
                $('#' + this.section + '-text-10').html(row);
                $('#' + this.section + '-title-10').remove();
            });


        }
    }

    UCC.prototype.show_url_events = function() {
        $('#' + this.section + '-table-1 .select-checkbox').click(function() {
            var rows_selected = $('#' + that.section + '-table-1 tbody .selected');
            if (rows_selected.length == 0) {
                $('#' + that.section + '-title-1').first().prepend(create_trash_btn(that.section + '-table-1-trash'));
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
                $('#' + that.section + '-title-1').first().prepend(create_trash_btn(that.section + '-table-1-trash'));
                that.trash_event();
            }
        });

    }

    UCC.prototype.send_filters = function(data) {
        chrome.runtime.sendMessage(chrome.runtime.id, { id: that.dB.REQUEST.URL_SET_FILTERS, data: data }, this.show_filters);
    }

    UCC.prototype.save_url_enabled = function() {
        getMessage(this.checked ? "enabled" : "disabled", that.section + "-enabled-label-1");
        that.send_url_enabled(this.checked);
    }

    UCC.prototype.send_url_enabled = function(data) {
        chrome.runtime.sendMessage(chrome.runtime.id, { id: that.dB.REQUEST.URL_SET_ENABLED, data: data }, this.show);
    }

    UCC.prototype.send_urls_add = function(data, reset) {
        var ret = { data: data, reset: reset };
        chrome.runtime.sendMessage(chrome.runtime.id, { id: that.dB.REQUEST.URL_ADD_URLS, data: ret }, this.show);
    }

    UCC.prototype.send_urls_remove = function(data) {
        chrome.runtime.sendMessage(chrome.runtime.id, { id: that.dB.REQUEST.URL_REMOVE_URLS, data: data }, this.show);
    }

    UCC.prototype.send_url_type = function(data) {
        chrome.runtime.sendMessage(chrome.runtime.id, { id: that.dB.REQUEST.URL_SET_TYPE, data: data }, this.show);
    }

    UCC.prototype.request_data = function() {
        chrome.runtime.sendMessage(chrome.runtime.id, { id: DOWNLOAD.REQUEST.GET_DATA }, this.show);
    }

    UCC.prototype.save_type = function() {
        getMessage(this.checked ? "whiteList" : "blackList", that.section + "-switch-label-1");
        var type = undefined;
        if (this.checked)
            type = 0;
        else
            type = 1;
        that.send_url_type(type);
    }

    UCC.prototype.import_json = function(data, rows) {
        try {
            var json = JSON.parse(data);
            this.import_enabled_json(json);
            this.import_type_json(json);
            this.import_urls_json(json, rows);
        } catch (e) {
            popUpController.create_error_msg(e.message);
            request_data();
        }
    }

    UCC.prototype.import_urls = function(data, file, override) {

        $('#' + that.section + '-text-1').html(create_elem('div', {
            classList: ['spinner-border', 'text-primary']
        }));

        var rows = [];
        switch (get_file_extension(file.name)) {
            case 'json':
                that.import_json(data, rows);
                break;
            case 'csv':
                that.import_urls_csv(data, rows);
                break;
            case 'txt':
                that.import_urls_txt(data, rows);
                break;
            default:
                popUpController.create_error_msg('invalid_format');
                break;
        }
        that.send_urls_add(rows, override);
    }
})(UrlCardController);