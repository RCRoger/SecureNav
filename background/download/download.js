var urls = undefined;
var max_size = undefined;
var type = undefined;
var enabled = undefined;

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

function dwl_listener(file){
    if(type == 0){
        download_allower(file);
    }
    else if(type == 0){
        download_blocker(file);
    }
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

function download_allower(file){
    chrome.downloads.pause(file.id);
    console.log('Pausada');
    
    if (url_block(file) || size_block(file)){
        chrome.downloads.resume(file.id);
        console.log('resumida');
        
        //TODO add pop up info
    }
    else{
        chrome.downloads.cancel(file.id);
        console.log('Cancelada');
    }
}

function add_blocker_listener(){
    urls = [];
    chrome.storage.local.get(['dwl_enabled', 'dwl_type', 'dwl_url_list', 'dwl_max_size'], function(data){
        chrome.downloads.onCreated.removeListener(dwl_listener);
        if(!data.enabled){
            return;
        }
        type = data.dwl_type;
        data.dwl_url_list.forEach(item => urls.push(url_regex(item)));
        max_size = data.dwl_max_size;
        if ((Array.isArray(urls) && urls.length) || max_size) {
            chrome.downloads.onCreated.addListener(dwl_listener);
        }
    });
}

add_blocker_listener();