chrome.browserAction.setBadgeText({ text: '' });


$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    if (e.target.id == 'download-tab')
        show_download();
    else if (e.target.id == 'general-tab') {
        show_general();
    } else if (e.target.id == 'sites-tab') {
        show_page();
    }
});