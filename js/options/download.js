function init_download(){
    getMessage("download_tab", "download-tab");
    getMessage("dwl_title", "dwl-title-1");

    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        if(e.target.id == 'download-tab')
            show_download();
        });
}

function show_download(){
    var tbl = document.createElement('table');
    tbl.id = 'dwl-table';
    tbl.classList.add('table', 'table-bordered');
    var thead = document.createElement('thead');
    tbl.appendChild(thead);
    var tr = document.createElement('tr');
    thead.appendChild(tr);
    var th = document.createElement('th');
    th.innerHTML = 'Protocol';
    tr.appendChild(th);
    th = document.createElement('th');
    th.innerHTML = 'SubDomain';
    tr.appendChild(th);
    th = document.createElement('th');
    th.innerHTML = 'Domain';
    tr.appendChild(th);
    th = document.createElement('th');
    th.innerHTML = 'Page';
    tr.appendChild(th);

    var tbody = document.createElement('tbody');
    tbl.appendChild(tbody);

    chrome.storage.local.get('download', function(data){
        data.download.url_list.forEach((item) => {
            for (let index = 0; index < 50; index++) {
                
            
            var tr = document.createElement('tr');
            tbody.appendChild(tr);
            var td = document.createElement('td');
            tr.appendChild(td);
            td.innerHTML = item.protocol;

            td = document.createElement('td');
            tr.appendChild(td);
            td.innerHTML = item.host;

            td = document.createElement('td');
            tr.appendChild(td);
            td.innerHTML = item.host;

            td = document.createElement('td');
            tr.appendChild(td);
            td.innerHTML = item.page;
            }
        });

        $('#dwl-text-1').html(tbl);
        $('#dwl-table').dataTable({
            "paging": false,
            "fnInitComplete": function () {
            var myCustomScrollbar = document.querySelector('#dt-vertical-scroll_wrapper .dataTables_scrollBody');
            var ps = new PerfectScrollbar(myCustomScrollbar);
            },
            "scrollY": 350,
            columnDefs: [{
              orderable: false,
              className: 'select-checkbox',
              targets: 0
            }],
            select: {
              style: 'multi',
              selector: 'td:first-child'
            }
          });

    });

    
}
