var pg_charged = false;
var pg_section = 'pg';

var pg_url = new UrlCardController(pg_section, PAGE);


var init_pages = function () {
  getMessage("sites_tab", "sites-tab");

}

var show_page = function () {
  if (!pg_charged) {
    pg_url.init_urlist_components();
    pg_charged = true;
  }
  pg_load_all();

}

function pg_load_all() {
  chrome.runtime.sendMessage(chrome.runtime.id, { id: PAGE.REQUEST.GET_DATA }, pg_show_all);
}

function pg_show_all(data) {
  pg_url.show_url(data);
}
