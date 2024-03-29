var grl_charged = false;

var show_general = function() {
    if (!grl_charged) {
        init_grl_components();
    }
    load_grl_info();
}

function init_grl_components() {
    grl_charged = true;

    var col_block = create_elem('div', {
        classList: ['col']
    });

    col_block.id = 'grl_block';

    var col_check = create_elem('div', {
        classList: ['col']
    });

    col_check.id = 'grl_check';

    var col_log = create_elem('div', {
        classList: ['col', 'text-truncate', 'text-default', 'mt-5']
    });

    col_log.id = 'grl_log';

    var pre_row = create_elem('div', {
        classList: ['row'],
        children: [col_log]
    });

    var row = create_elem('div', {
        classList: ['row', 'row-cols-2', 'text-center'],
        children: [col_block, col_check]
    });

    $('#grl-container').append(pre_row, row);

    add_card('grl', 1, col_block);
    add_card('grl', 2, col_check);

    $('#grl-header-1').html(getMessageStr('num_blocked'));
    $('#grl-header-2').html(getMessageStr('num_checked'));
    $('#grl-title-1').addClass('text-default');
    $('#grl-title-2').addClass('text-default');
    $('#grl_log .text-dark').css('font-size', '12px');

}

function load_grl_info() {
    chrome.runtime.sendMessage(chrome.runtime.id, { id: CONTROLLER.REQUEST.GET_DATA }, show_grl_info);
    chrome.runtime.sendMessage(chrome.runtime.id, { id: LOGGER.REQUEST.LAST_ROWS, data: 1 }, show_grl_log);
}

function show_grl_info(data) {
    if (data.blocks !== undefined) {
        $('#grl-title-1').html(data.blocks);
    }

    if (data.checks !== undefined) {
        $('#grl-title-2').html(data.checks);
    }
}

function show_grl_log(data) {
    let elem = document.getElementById('grl_log');
    if (data.rows && data.rows.length > 0) {
        elem.innerHTML = get_msg(data.rows[0]);
        elem.title = elem.innerText;
        $(elem).tooltip({ boundary: 'window' });
        $('#grl_log span').css('font-size', '10px');
    } else {
        $('#grl_log').text(getMessageStr('nothing_show'));
    }
}

show_general();