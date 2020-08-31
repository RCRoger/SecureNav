chrome.browserAction.setBadgeText({ text: '' });


$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    if (e.target.id == 'download-tab')
        show_download();
    else if (e.target.id == 'general-tab') {
        show_general();
    } else if (e.target.id == 'sites-tab') {
        show_page();
    } else if (e.target.id == 'popup-tab') {
        show_emergent();
    }
});

function set_titles() {
    $('#general-tab').prop('title', getMessageStr('general_tab'));
    $('#download-tab').prop('title', getMessageStr('download_tab'));
    $('#malware-tab').prop('title', getMessageStr('malware_tab'));
    $('#sites-tab').prop('title', getMessageStr('sites_tab'));
    $('#popup-tab').prop('title', getMessageStr('popup_tab'));
    $('#super-tab').prop('title', getMessageStr('super_tab'));

    $('a[data-toggle="tab"]').tooltip();
}

set_titles();