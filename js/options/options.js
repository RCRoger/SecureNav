$(document).ready(function(){
    init();
    
    getMessage("malware_tab", "malware-tab");
    getMessage("sites_tab", "sites-tab");
    getMessage("popup_tab", "popup-tab");
    getMessage("super_tab", "super-tab");

});

function init(){
    init_gral();
    init_download();
}
