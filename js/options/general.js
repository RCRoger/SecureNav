var grl_section = 'grl';
var grl_charged = false;

function init_gral() {
    getMessage("general_tab", "general-tab");
}

var show_general = function() {
    if (!grl_charged) {
        init_bell_components();
    }
    load_grl();
}


var init_bell_components = function() {
    grl_charged = true;
    const num = 1;
    add_card(grl_section, num);

    var a = document.createElement('a');
    a.classList.add('float-left');
    a.id = grl_section + "-title-a-" + num;
    $('#' + grl_section + '-title-' + num).append(a);
    getMessage('recent_logs', a.id);


}

var load_grl = function() {
    chrome.runtime.sendMessage(chrome.runtime.id, { id: LOGGER.REQUEST.LAST_ROWS }, show);
}

var show = function(data) {

    if (data.rows && data.rows.length > 0) {
        var div = create_elem('div', { classList: ['text-default', 'scrollbar', 'scrollbar-default'], attributes: [{ key: 'style', value: 'width:95%;' }] });
        data.rows.forEach(row => {
            var p = create_elem('p');
            extract_message(p, row);
            div.appendChild(p);
        });
        $('#' + grl_section + '-text-' + 1).html(div);
    } else {
        $('#' + grl_section + '-text-' + 1).text(getMessageStr('nothing_show'));
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