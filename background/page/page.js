function PageBackground(popUp = undefined){
    this.urls = new PageUrlList();
    this.show_info = undefined;
    this.popUp = popUp;
    this.loadData(true);
}

(function (PB, undefined) {

    PB.prototype.add_listener = function () {
        chrome.downloads.onCreated.removeListener(pgb_listener);
        chrome.downloads.onCreated.addListener(pgb_listener);
    }

})(PageBackground);

function PageUrlList(){
    this.urls = undefined;
    this.urls_str = undefined;
    this.type = undefined;
    this.enabled = undefined;
}

(function (PU, undefined) {

    PU.prototype.add_listener = function () {
        chrome.downloads.onCreated.removeListener(pgb_listener);
        chrome.downloads.onCreated.addListener(pgb_listener);
    }

    DB.prototype.loadData = function (first = undefined) {
        var that = this;
        chrome.storage.local.get(['dwl_url_enabled', 'dwl_url_type', 'dwl_url_list', 'dwl_size_enabled', 'dwl_max_size', 'dwl_show_info'], function (data) {
            that.urls.loadData(data);
            that.max_size.loadData(data);
            that.show_info = data.dwl_show_info;
            if (first)
                that.add_listener();
        });
    }

})(PageBackground);



var page_background = new PageBackground();

var pgb_listener = function () {
    page_background.block_action();
}

const webRequestFlags = [
    'blocking',
  ];

function page_blocker(page){
    return {
        cancel: true,
    }
}

function add_blocker_listener(){
    let urls = [];
    chrome.storage.local.get('pages', function(data){
        data.download.url_list.forEach(item => urls.push(item.str));
        if (Array.isArray(urls) && urls.length) {
            var filter = { 'urls': urls }
            window.chrome.webRequest.onBeforeRequest.removeListener(page_blocker);
            window.chrome.webRequest.onBeforeRequest.addListener(page_blocker,
                filter,
                webRequestFlags,
            );
        }
    });
}

add_blocker_listener();

