function getMessage(msg, item) {
    var message = chrome.i18n.getMessage(msg);
    document.getElementById(item).innerHTML = message;
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

function add_rows_edit($tableID){
    const $clone = $tableID.find('tbody tr').last().clone(true).removeClass('hide table-line');
    $tableID.append($clone).find('tbody tr').last().find('td').empty();
}

function add_card(section, num) {
    var card = create_card();

    var header = create_card_header(card);

    header.id = section + '-header-' + num;

    var body = create_card_body(card);

    var title = create_card_title(body);

    title.id = section + '-title-' + num;

    var text = create_card_text(body);

    text.id = section + '-text-' + num;

    $('#' + section + '-container').append(card);

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
    card.classList.add('card');
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

function create_add_btn(id){
    var add_btn = document.createElement('span');
    add_btn.id = id;
    add_btn.classList.add('table-add', 'float-right', 'mt-2', 'mb-6', 'mr-2');

    var a = document.createElement('a');
    a.classList.add('text-success');
    var icon = document.createElement('i');
    icon.classList.add('fas', 'fa-plus', 'fa-2x');
    a.appendChild(icon);
    add_btn.appendChild(a);

    return add_btn;
}

function create_save_btn(id){
    var save_btn = document.createElement('span');
    save_btn.classList.add('mt-2', 'mb-6', 'mr-2');
    save_btn.id = id;
    var a = document.createElement('a');
    a.classList.add('text-primary');
    var icon = document.createElement('i');
    icon.classList.add('far', 'fa-save', 'fa-2x');
    a.appendChild(icon);
    save_btn.appendChild(a);

    return save_btn;
}

function create_trash_btn(id){
    var trash_btn = document.createElement('span');
    trash_btn.classList.add('table-add', 'float-right', 'mt-2', 'mr-2');
    trash_btn.id = id;
    var a = document.createElement('a');
    a.classList.add('text-danger');
    var icon = document.createElement('i');
    icon.classList.add('fas', 'fa-trash', 'fa-2x');
    a.appendChild(icon);
    trash_btn.appendChild(a);

    return trash_btn;
}
