function getMessage(msg, item) {
    var message = chrome.i18n.getMessage(msg);
    document.getElementById(item).innerHTML = message;
}

function create_table(id, headers, rows){
    var tbl = document.createElement('table');
    tbl.id = id;
    tbl.cellSpacing = 0;
    tbl.classList.add('table', 'table-bordered');
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