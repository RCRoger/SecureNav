var urls = undefined;

function download_blocker(file){
    chrome.downloads.pause(file.id);
    console.log('Pausada');
    if (urls.some(function(item){
        if(item.exec(file.url) || item.exec(file.finalUrl))
            return true;
        
    })){
        chrome.downloads.cancel(file.id);
        console.log('Cancelada');
    }
    else{
        chrome.downloads.resume(file.id);
        console.log('resumida');
    }
}

function add_blocker_listener(){
    urls = [];
    chrome.storage.local.get('download', function(data){
        data.download.url_list.forEach(item => urls.push(url_regex(item)));
        if (Array.isArray(urls) && urls.length) {
            chrome.downloads.onCreated.removeListener(download_blocker);
            chrome.downloads.onCreated.addListener(download_blocker);
        }
    });
}

add_blocker_listener();