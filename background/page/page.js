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

//add_blocker_listener();

