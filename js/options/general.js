var grl_section = 'grl';
var grl_charged = false;

function init_gral(){
    getMessage("general_tab", "general-tab");
}

var show_general = function () {
    if (!grl_charged) {
        init_bell_components();
    }
  }
  

var init_bell_components = function () {
    grl_charged = true;
    const num = 1;
    add_card(grl_section, num);
  
    var a = document.createElement('a');
    a.classList.add('float-left');
    a.id = grl_section + "-title-a-" + num;
    $('#' + grl_section + '-title-' + num).append(a);
    getMessage(grl_section + "_title", a.id);
  
  
  }


