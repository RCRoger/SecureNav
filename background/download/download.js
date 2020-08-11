var urls = undefined;
var max_size = undefined;

function url_block(file){
    if (Array.isArray(urls) && urls.length){
        return urls.some(function(item){
            if(item.exec(file.url) || item.exec(file.finalUrl))
                return true;
            
        });
    }

    return false;
    
}

function size_block(file){
    return max_size > file.fileSize;
}

function download_blocker(file){
    chrome.downloads.pause(file.id);
    console.log('Pausada');

    if (url_block(file) || size_block(file)){
        chrome.downloads.cancel(file.id);
        console.log('Cancelada');
        //TODO add pop up info
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
        max_size = data.download.max_size;
        if ((Array.isArray(urls) && urls.length) || max_size) {
            chrome.downloads.onCreated.removeListener(download_blocker);
            chrome.downloads.onCreated.addListener(download_blocker);
        }
    });
}

add_blocker_listener();