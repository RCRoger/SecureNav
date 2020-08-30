var pg_changed = false;
var show_page = function() {
    if (!pg_changed) {
        pg_init_urlist_components();
    }
    pg_load_info();
}

function pg_init_urlist_components() {
    pg_changed = true;
    add_card('pg', 1);

    var p = document.createElement('p');
    p.id = 'pg-url-status-p';

    var a = document.createElement('a');
    a.classList.add('text-info', 'text-justify');
    a.id = 'pg-url-status';

    p.appendChild(a);

    $('#pg-title-1').html(p);

    $('#pg-text-1').addClass('text-center');


}

function pg_show_url_info(data) {

    if (!data.enabled) {
        $('#pg-header-1').text(getMessageStr('mode') + getMessageStr('disabled'));
        var btn = create_button('pg-url-enable');
        btn.classList.add('btn-success');
        btn.innerHTML = getMessageStr('enable');
        $('#pg-text-1').html(btn);
        $('#pg-url-enable').click(function() {
            var id = PAGE.REQUEST.URL_SET_ENABLED_LITE;
            chrome.runtime.sendMessage(chrome.runtime.id, { id: id, data: true }, pg_show_url_info);
        });
        return;
    }

    if (data.type == 0) {
        $('#pg-header-1').text(getMessageStr('mode') + getMessageStr('whitelist'));
    } else if (data.type == 1) {
        $('#pg-header-1').text(getMessageStr('mode') + getMessageStr('blacklist'));
    }

    var msg = '';
    var icon = undefined;
    if (data.hasBlock) {
        msg = getMessage('pg_url_status_0', 'pg-url-status');
        icon = create_cross_btn('pg_url_status_icon');
        reload_page();
    } else {
        getMessage('pg_url_status_1', 'pg-url-status');
        icon = create_check_btn('pg_url_status_icon');
    }
    $('#pg_url_status_icon').remove();
    $('#pg-url-status-p').prepend($(icon));


    var button = create_button('pg-url-block');

    if (data.type == 0) {
        if (data.hasBlock) {
            button.classList.add('btn-success');
            button.innerHTML = getMessageStr('unblock');
            $('#pg-text-1').html(button);
        } else {
            $('#pg-text-1').empty();
        }
    } else if (data.type == 1) {
        if (!data.hasBlock) {
            button.classList.add('btn-danger');
            button.innerHTML = getMessageStr('block');
            $('#pg-text-1').html(button);
        } else {
            $('#pg-text-1').empty();
        }
    }

    $('#pg-url-block').click(function() {
        chrome.runtime.sendMessage(chrome.runtime.id, { id: PAGE.REQUEST.ADD_URL, data: { url: data.url } }, pg_show_url_info);
    });

}

function reload_page() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs.length > 0)
            chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
    });
}

function pg_load_info() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        let url = tabs[0].url;
        var id = PAGE.REQUEST.URL_GET_DATA;
        chrome.runtime.sendMessage(chrome.runtime.id, { id: id, data: { 'url': url, 'urlFinal': url } }, pg_show_url_info);
    });
}