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

    }

    UCC.prototype.show_url_events = function() {
        $('#' + this.section + '_url_add').click(this.addRows);
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

    UCC.prototype.save_url_enabled = function() {
        getMessage(this.checked ? "enabled" : "disabled", that.section + "-enabled-label-1");
        that.send_url_enabled(this.checked);
    }

    UCC.prototype.send_url_enabled = function(data) {
        chrome.runtime.sendMessage(chrome.runtime.id, { id: that.dB.REQUEST.URL_SET_ENABLED, data: data });
    }

    UCC.prototype.send_urls_add = function(data, reset) {
        var ret = { data: data, reset: reset };
        chrome.runtime.sendMessage(chrome.runtime.id, { id: that.dB.REQUEST.URL_ADD_URLS, data: ret }, this.show);
    }

    UCC.prototype.send_urls_remove = function(data) {
        chrome.runtime.sendMessage(chrome.runtime.id, { id: that.dB.REQUEST.URL_REMOVE_URLS, data: data }, this.show);
    }

    UCC.prototype.send_url_type = function(data) {
        chrome.runtime.sendMessage(chrome.runtime.id, { id: that.dB.REQUEST.URL_SET_TYPE, data: data });
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

    UCC.prototype.import_enabled_json = function(json) {
        var status = 'OK';

        var enabled = json[this.dB.DB.URL_ENABLED];
        if (enabled !== undefined) {
            if (enabled === true || enabled === false) {
                this.send_url_enabled(enabled);
            } else {
                status = 'invalid_format';
                throw new Error(status);
            }
        }
    }

    UCC.prototype.import_type_json = function(json) {
        var status = 'OK';

        var type = json[this.dB.DB.URL_TYPE];
        if (type !== undefined) {
            if (type === 0 || type === 1) {
                this.send_url_type(type);
            } else {
                status = 'invalid_format';
                throw new Error(status);
            }
        }
    }

    UCC.prototype.import_urls_json = function(json, rows) {
        var status = 'OK';

        var list = json[this.dB.DB.URL_LIST];
        if (list !== undefined) {
            if (!Array.isArray(list)) {
                status = 'invalid_format';
                throw new Error(status);
            }

            list.forEach(item => {

                var scheme = item['protocol'];
                var host = item['host'];
                var page = item['page'];
                var str = item['str']
                if (scheme === undefined || host === undefined || page === undefined || str === undefined) {
                    status = 'invalid_format';
                } else if (!is_scheme_valid(scheme) || !is_host_valid(host)) {
                    status = 'invalid_pattern'
                }
                if (status != 'OK') {
                    rows.splice(0, rows.length);
                    throw new Error(status);
                }
                rows.push(item);
            });
        }
    }

    UCC.prototype.import_urls_csv = function(data, rows) {
        try {
            var csv = data.split(/(\,|\;)/);
            if (csv.length > 0) {
                csv.forEach(url => {
                    if (url.length == 0) return;
                    var item = get_item_from_str(url);
                    if (!is_scheme_valid(item.protocol) || !is_host_valid(item.host)) {
                        rows.splice(0, rows.length);
                        throw new Error('invalid_pattern');
                    }
                    rows.push(item);
                });
            } else {
                throw new Error('invalid_format');
            }
        } catch (e) {
            popUpController.create_error_msg(e.message);
        }
    }

    UCC.prototype.import_urls_txt = function(data, rows) {
        try {
            var txt = data.split('\n');
            if (txt.length > 0) {
                txt.forEach(url => {
                    if (url.length == 0) return;
                    var item = get_item_from_str(url);
                    if (!is_scheme_valid(item.protocol) || !is_host_valid(item.host)) {
                        rows.splice(0, rows.length);
                        throw new Error('invalid_pattern');
                    }
                    rows.push(item);
                });
            } else {
                throw new Error('invalid_format');
            }
        } catch (e) {
            popUpController.create_error_msg(e.message);
        }
    }




})(UrlCardController);