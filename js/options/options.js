$(document).ready(function () {
    init();

    getMessage("malware_tab", "malware-tab");
    getMessage("popup_tab", "popup-tab");
    getMessage("super_tab", "super-tab");

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        switch (e.target.id) {
            case 'download-tab':
                show_download();
                break;
            case 'sites-tab':
                show_page();
                break;

        }
      });
});

function init() {
    init_gral();
    init_download();
    init_pages();
}
