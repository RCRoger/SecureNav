var eme_changed = false;
var show_emergent = function() {
    if (!eme_changed) {
        eme_init_urlist_components();
    }
    eme_load_info();
}

function eme_init_urlist_components() {
    eme_changed = true;
    add_card('eme', 1);

    var p = document.createElement('p');
    p.id = 'eme-url-status-p';

    var a = document.createElement('a');
    a.classList.add('text-info', 'text-justify');
    a.id = 'eme-url-status';

    p.appendChild(a);

    $('#eme-title-1').html(p);

    $('#eme-text-1').addClass('text-center');


}

function eme_show_url_info(data) {

    if (!data.enabled) {
        $('#eme-header-1').text(getMessageStr('mode') + getMessageStr('disabled'));
        var btn = create_button('eme-url-enable');
        btn.classList.add('btn-success');
        btn.innerHTML = getMessageStr('enable');
        $('#eme-text-1').html(btn);
        $('#eme-url-enable').click(function() {
            var id = EMERGENT.REQUEST.URL_SET_ENABLED_LITE;
            chrome.runtime.sendMessage(chrome.runtime.id, { id: id, data: true }, eme_show_url_info);
        });
        return;
    }

    if (data.type == 0) {
        $('#eme-header-1').text(getMessageStr('mode') + getMessageStr('whitelist'));
    } else if (data.type == 1) {
        $('#eme-header-1').text(getMessageStr('mode') + getMessageStr('blacklist'));
    }

    var msg = '';
    var icon = undefined;
    if (data.hasBlock) {
        msg = getMessage('eme_url_status_0', 'eme-url-status');
        icon = create_cross_btn('eme_url_status_icon');
    } else {
        getMessage('eme_url_status_1', 'eme-url-status');
        icon = create_check_btn('eme_url_status_icon');
    }
    $('#eme_url_status_icon').remove();
    $('#eme-url-status-p').prepend($(icon));


    var button = create_button('eme-url-block');

    if (data.type == 0) {
        if (data.hasBlock) {
            button.classList.add('btn-success');
            button.innerHTML = getMessageStr('unblock');
            $('#eme-text-1').html(button);
        } else {
            $('#eme-text-1').empty();
        }
    } else if (data.type == 1) {
        if (!data.hasBlock) {
            button.classList.add('btn-danger');
            button.innerHTML = getMessageStr('block');
            $('#eme-text-1').html(button);
        } else {
            $('#eme-text-1').empty();
        }
    }

    $('#eme-url-block').click(function() {
        chrome.runtime.sendMessage(chrome.runtime.id, { id: EMERGENT.REQUEST.ADD_URL, data: { url: data.url } }, eme_show_url_info);
    });
}

function eme_load_info() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        let url = tabs[0].url;
        var id = EMERGENT.REQUEST.URL_GET_DATA;
        chrome.runtime.sendMessage(chrome.runtime.id, { id: id, data: { 'url': url, 'urlFinal': url } }, eme_show_url_info);
    });
}