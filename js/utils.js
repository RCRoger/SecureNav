function getMessage(msg, item) {
    var message = chrome.i18n.getMessage(msg);
    document.getElementById(item).innerHTML = message;
}

function create_table(id, headers, rows){
    var tbl = document.createElement('table');
    tbl.id = id;
    tbl.cellSpacing = 0;
    tbl.classList.add('table', 'table-bordered', 'text-center');
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

    rows.forEach(element => {
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
    });
    return tbl;
}

function add_card(section, num){
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
 
function create_checkbox(section, type, num, classList = []){
    var div = document.createElement('div');
    div.classList.add('custom-control');
    classList.forEach(item => {
        div.classList.add(item);
    });
    var input = document.createElement('input');
    input.classList.add('custom-control-input');
    input.id = section + '-' + type + '-' + num;
    input.type  = "checkbox";
    div.appendChild(input);

    var label = document.createElement('label');
    label.classList.add('custom-control-label');
    label.id = section + '-' + type + '-label-' + num;
    label.setAttribute('for', input.id);
    div.appendChild(label);

    return div;
}

function create_card(){
    var card = document.createElement('div');
    card.classList.add('card');
    return card;
}

function create_card_header(card){
    var header = document.createElement('div');
    header.classList.add('card-header');
    card.appendChild(header);
    return header;
}

function create_card_body(card){
    var body = document.createElement('div');
    body.classList.add('card-body');
    card.appendChild(body);
    return body;
}

function create_card_title(body){
    var title = document.createElement('div');
    title.classList.add('card-title', 'mb-5');
    body.appendChild(title);
    return title;
}

function create_card_text(body){
    var text = document.createElement('div');
    text.classList.add('card-text');
    body.appendChild(text);
    return text;
}
