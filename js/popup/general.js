var grl_charged = false;

var show_general = function() {
    if (!grl_charged) {
        init_grl_components();
    }
    //load_info();
}

function init_grl_components() {
    grl_charged = true;
    add_card('grl', 1);

    $('#grl-header-1').html(getMessageStr('recent_logs'));
    $('#grl-text-1').parent().addClass('scrollbar scrollbar-default').html('que tal es veu? UwU');

}

function show_grl_info(data) {




}

show_general();