var grl_section = 'grl';
var grl_charged = false;

function init_gral() {
    getMessage("general_tab", "general-tab");
}

var show_general = function() {
    if (!grl_charged) {
        init_info_components();
        init_count_components();
    }
    load_grl();
}


var init_info_components = function() {
    grl_charged = true;
    const num = 1;
    add_card(grl_section, num);
    getMessage('recent_logs', 'grl-header-1');


}

var init_count_components = function() {
    grl_charged = true;

    var col_block = create_elem('div', {
        classList: ['col']
    });

    col_block.id = 'grl_block';

    var col_check = create_elem('div', {
        classList: ['col']
    });

    col_check.id = 'grl_check';

    var row = create_elem('div', {
        classList: ['row', 'row-cols-2', 'text-center'],
        children: [col_block, col_check]
    });

    $('#grl-container').append(row);

    add_card('grl', 2, col_block);
    add_card('grl', 3, col_check);

    $('#grl-header-2').html(getMessageStr('num_blocked'));
    $('#grl-header-3').html(getMessageStr('num_checked'));
    $('#grl-title-2').addClass('text-default');
    $('#grl-title-3').addClass('text-default');
}



var load_grl = function() {
    chrome.runtime.sendMessage(chrome.runtime.id, { id: LOGGER.REQUEST.LAST_ROWS }, show);
    chrome.runtime.sendMessage(chrome.runtime.id, { id: CONTROLLER.REQUEST.GET_DATA }, show_grl_count);
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


function show_grl_count(data) {
    if (data.blocks !== undefined) {
        $('#grl-title-2').html(data.blocks);
    }

    if (data.checks !== undefined) {
        $('#grl-title-3').html(data.checks);
    }
}