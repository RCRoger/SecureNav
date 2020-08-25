var pg_charged = false;
var pg_section = 'pg';

var pg_url = new UrlCardController(pg_section, PAGE);
var pg_not = new NotiCardController(pg_section, PAGE, 2);


var init_pages = function () {
  getMessage("sites_tab", "sites-tab");

}

var show_page = function () {
  if (!pg_charged) {
    pg_url.init_components();
    init_pg_components();
    pg_not.init_components('#pg-col-not');
    pg_charged = true;
  }
  pg_load_all();

}

function pg_load_all() {
  chrome.runtime.sendMessage(chrome.runtime.id, { id: PAGE.REQUEST.GET_DATA }, pg_show_all);
}

function pg_show_all(data) {
  pg_url.show(data);
  pg_not.show(data);
}

var init_pg_components = function(){
  var div_params = {
    classList:['row']
  }
  var div = create_elem('div', div_params);
  div.id = 'pg-row-2';

  var col1 = create_elem('div', {classList:['col']});
  col1.id = 'pg-col-not';
  div.appendChild(col1);
  
  $('#' + pg_section + '-container').append(div);

}