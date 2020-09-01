$(document).ready(function() {
    init();

    getMessage("malware_tab", "malware-tab");

    show_general();

    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        switch (e.target.id) {
            case 'download-tab':
                show_download();
                break;
            case 'sites-tab':
                show_page();
                break;
            case 'general-tab':
                show_general();
                break;
            case 'popup-tab':
                show_emergent();
                break;
            case 'super-tab':
                show_super();
                break;
        }
    });
});

function init() {
    init_gral();
    init_download();
    init_pages();
    init_popup();
    init_super();
}