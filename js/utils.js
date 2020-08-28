function getMessage(msg, item) {
    var message = chrome.i18n.getMessage(msg);
    document.getElementById(item).innerHTML = message;
}

function getMessageStr(msg) {
    var message = chrome.i18n.getMessage(msg);
    if (message)
        return message;
    return ' ' + msg;
}

function create_table(id, headers, rows) {
    var tbl = document.createElement('table');
    tbl.id = id;
    tbl.cellSpacing = 0;
    tbl.classList.add('table', 'table-bordered', 'text-center', 'table-striped');
    var thead = document.createElement('thead');
    tbl.appendChild(thead);
    var tr = document.createElement('tr');
    tr.classList.add('th-sm');
    thead.appendChild(tr);
    var th = document.createElement('th');
    tr.appendChild(th);
    headers.forEach(element => {
        th = document.createElement('th');
        tr.appendChild(th);
        th.innerHTML = element;
    });


    var tbody = document.createElement('tbody');
    tbl.appendChild(tbody);

    for (let i = 0; i < rows.length; i++) {
        const element = rows[i];
        tr = document.createElement('tr');
        tbody.appendChild(tr);
        var td = document.createElement('td');
        tr.appendChild(td);

        for (let index = 0; index < element.length; index++) {
            const item = element[index];
            td = document.createElement('td');
            tr.appendChild(td);
            td.innerHTML = item;
        }
    }
    return tbl;
}

function add_row_table($tableID, rows) {
    var tr = $('<tr>');
    rows.forEach(col => {
        tr.append($('<td>').append($(col)));
    });
    $tableID.find('tbody').append(tr);
}

function create_editable_table(id, headers) {
    var tbl = document.createElement('table');
    tbl.id = id;
    tbl.cellSpacing = 0;
    tbl.classList.add('table', 'table-sm', 'table-bordered', 'text-center', 'table-striped');

    var thead = document.createElement('thead');
    tbl.appendChild(thead);
    var tr = document.createElement('tr');
    tr.classList.add('th-sm');
    thead.appendChild(tr);

    var th = undefined;
    var td = undefined;

    var tbody = document.createElement('tbody');
    tbl.appendChild(tbody);
    var tr1 = document.createElement('tr');
    tbody.appendChild(tr1);


    headers.forEach(element => {
        th = document.createElement('th');
        tr.appendChild(th);
        th.innerHTML = element;

        td = document.createElement('td');
        td.setAttribute('contenteditable', 'true');
        tr1.appendChild(td);
    });
    return tbl;
}

function add_rows_edit($tableID) {
    const $clone = $tableID.find('tbody tr').last().clone(true).removeClass('hide table-line');
    $tableID.append($clone).find('tbody tr').last().find('td').empty();
}

function add_card(section, num, parent = undefined) {
    var card = create_card();
    card.id = section + '-card-' + num;

    var header = create_card_header(card);

    header.id = section + '-header-' + num;

    var body = create_card_body(card);

    var title = create_card_title(body);

    title.id = section + '-title-' + num;

    var text = create_card_text(body);

    text.id = section + '-text-' + num;
    if (!parent)
        $('#' + section + '-container').append(card);
    else
        $(parent).append(card);

}

function create_checkbox(section, type, num, classList = []) {
    var div = document.createElement('div');
    div.classList.add('custom-control');
    classList.forEach(item => {
        div.classList.add(item);
    });
    var input = document.createElement('input');
    input.classList.add('custom-control-input');
    input.id = section + '-' + type + '-' + num;
    input.type = "checkbox";
    div.appendChild(input);

    var label = document.createElement('label');
    label.classList.add('custom-control-label');
    label.id = section + '-' + type + '-label-' + num;
    label.setAttribute('for', input.id);
    div.appendChild(label);

    return div;
}

function create_card() {
    var card = document.createElement('div');
    card.classList.add('card', 'mb-5', 'mt-5');
    return card;
}

function create_card_header(card) {
    var header = document.createElement('div');
    header.classList.add('card-header');
    card.appendChild(header);
    return header;
}

function create_card_body(card) {
    var body = document.createElement('div');
    body.classList.add('card-body');
    card.appendChild(body);
    return body;
}

function create_card_title(body) {
    var title = document.createElement('div');
    title.classList.add('card-title', 'mb-5');
    body.appendChild(title);
    return title;
}

function create_card_text(body) {
    var text = document.createElement('div');
    text.classList.add('card-text');
    body.appendChild(text);
    return text;
}

function create_modal_large(id = undefined) {

    var modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.setAttribute('role', 'dialog');

    var dialog = document.createElement('div');
    dialog.classList.add('modal-dialog');
    modal.appendChild(dialog);

    var content = document.createElement('div');
    content.classList.add('modal-content');
    dialog.appendChild(content);



    var header = document.createElement('div');
    header.classList.add('modal-header');
    content.appendChild(header);

    var body = document.createElement('div');
    body.classList.add('modal-body');
    content.appendChild(body);

    var footer = document.createElement('div');
    footer.classList.add('modal-footer');
    content.appendChild(footer);


    if (!id)
        return modal;

    modal.id = id;
    dialog.id = id + '-dialog';
    content.id = id + '-content';
    header.id = id + '-header';
    body.id = id + '-body';
    footer.id = id + '-footer';



    return modal;
}

function create_add_btn(id) {
    var params = {
        span: {
            classList: ['float-right', 'ml-5', 'mb-2', 'mr-2']
        },
        a: {
            classList: ['text-success']
        },
        icon: {
            classList: ['fas', 'fa-plus', 'fa-2x']
        }
    }
    var btn = create_icon(params);
    btn.id = id;
    return btn;
}

function create_save_btn(id) {
    var params = {
        span: {
            classList: ['mt-2', 'mb-6', 'mr-2']
        },
        a: {
            classList: ['text-primary']
        },
        icon: {
            classList: ['far', 'fa-save', 'fa-2x']
        }
    }
    var btn = create_icon(params);
    btn.id = id;
    return btn;
}

function create_trash_btn(id) {
    var params = {
        span: {
            classList: ['table-add', 'float-right', 'mr-2']
        },
        a: {
            classList: ['text-danger']
        },
        icon: {
            classList: ['fas', 'fa-trash', 'fa-2x']
        }
    }
    var btn = create_icon(params);
    btn.id = id;
    return btn;
}

function create_link_btn(id) {
    var params = {
        a: {
            classList: ['text-default']
        },
        icon: {
            classList: ['fas', 'fa-link', 'fa-lg']
        }
    }
    var btn = create_icon(params);
    btn.id = id;
    return btn;
}

function create_check_btn(id) {
    var params = {
        a: {
            classList: ['text-success']
        },
        icon: {
            classList: ['fas', 'fa-check-circle', 'fa-lg']
        }
    }
    var btn = create_icon(params);
    btn.id = id;
    return btn;
}

function create_cross_btn(id) {

    var params = {
        a: {
            classList: ['text-danger']
        },
        icon: {
            classList: ['fas', 'fa-times-circle', 'fa-lg']
        }
    }
    var btn = create_icon(params);
    btn.id = id;
    return btn;
}

function create_bell_icon(id) {
    var params = {
        a: {
            classList: ['amber-text']
        },
        icon: {
            classList: ['fas', 'fa-bell', 'fa-lg'],
        }
    }
    var btn = create_icon(params);
    btn.id = id;
    return btn;
}

function create_bell_crossed_icon(id) {
    var params = {
        a: {
            classList: ['text-muted']
        },
        icon: {
            classList: ['fas', 'fa-bell-slash', 'fa-lg'],
        }
    }
    var btn = create_icon(params);
    btn.id = id;
    return btn;
}

function create_input_group() {
    var div = document.createElement('div');
    div.classList.add('input-group');

    return div;
}

function add_group_prepend(group) {
    var div = document.createElement('div');
    div.classList.add('input-group-prepend');
    group.appendChild(div);
    return div;
}

function add_prepend_text(prepend, text) {
    var span = document.createElement('span');
    span.classList.add('input-group-text');
    span.innerHTML = text;
    prepend.appendChild(span);
    return span;
}

function add_group_input(id, group, type, aria = undefined) {
    var input = document.createElement('input');
    input.id = id;
    input.classList.add('form-control');
    if (aria)
        input.setAttribute('aria-label', aria);
    input.type = type;
    group.appendChild(input);

    return input;
}

function create_select(id, options, values = undefined) {
    var select = document.createElement('select');
    for (let index = 0; index < options.length; index++) {
        const element = options[index];
        var opt = document.createElement('option');
        opt.innerHTML = element;
        select.appendChild(opt);
        if (values) {
            opt.setAttribute('value', values[index]);
        }
    }

    select.id = id;

    return select;
}

function create_button(id, params = {}) {
    var btn = document.createElement('button');
    btn.classList.add('btn');
    btn.setAttribute('type', 'button');
    btn.id = id;
    add_params(btn, params);

    return btn;
}

function create_icon(params = {}) {
    var span = document.createElement('span');
    add_params(span, params.span);
    var a = document.createElement('a');
    add_params(a, params.a);
    var icon = document.createElement('i');
    add_params(icon, params.icon);
    a.appendChild(icon);
    span.appendChild(a);
    return span;
}

function create_elem(elem, params = {}) {
    var a = document.createElement(elem);
    add_params(a, params);
    return a;
}

function add_params(item, params) {
    if (params) {
        if (params.classList)
            params.classList.forEach(cls => {
                item.classList.add(cls);
            });
        if (params.attributes) {
            params.attributes.forEach(att => {
                item.setAttribute(att.key, att.value);
            });
        }
        if (params.innerHTML)
            item.innerHTML = params.innerHTML;

        if (params.children)
            params.children.forEach(child => {
                item.appendChild(child);
            });
    }
}

var extract_message = function(elem, text) {
    var span = create_elem('span', { classList: ['text-dark'] });
    var a = create_elem('a');
    elem.appendChild(span);
    elem.appendChild(a);
    var i = text.indexOf(':', 17);
    var ret = '';
    if (i != -1) {
        span.innerHTML = text.substring(0, i + 1) + ' ';
        var split = text.substring(i + 1).split(' ');
        split.forEach(key => {
            if (key.includes('_'))
                ret += getMessageStr(key);
            else
                ret += ' ' + key;
        });
    }
    a.innerText = ret;
}

var load_file = function(file, override, callback) {
    var reader = new FileReader();
    reader.onload = function() {
        var output = reader.result;
        callback(output, file, override);
    };
    reader.readAsText(file);
}

var get_file_extension = function(filename) {
    return filename.split('.').pop();
}