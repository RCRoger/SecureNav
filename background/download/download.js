function DownloadBackground() {
    this.urls = undefined;
    this.max_size = undefined;
    this.type = undefined;
    this.enabled = undefined;
    this.add_listener();
}

(function (DB, undefined) {
    DB.prototype.url_block = function (file) {
        if (Array.isArray(this.urls) && this.urls.length) {
            return this.urls.some(function (item) {
                if (item.exec(file.url) || item.exec(file.finalUrl))
                    return true;
            });
        }
        return false;
    }

    DB.prototype.size_block = function (file) {
        return this.max_size > file.fileSize;
    }

    DB.prototype.block_action = function(file){
        if (this.type == 0) {
            this.download_allower(file);
        }
        else if (this.type == 1) {
            this.download_blocker(file);
        }
    }

    DB.prototype.download_blocker = function (file) {
        chrome.downloads.pause(file.id);
        console.log('Pausada');

        if (this.url_block(file) || this.size_block(file)) {
            chrome.downloads.cancel(file.id);
            console.log('Cancelada');
            //TODO add pop up info
        }
        else {
            chrome.downloads.resume(file.id);
            console.log('resumida');
        }
    }

    DB.prototype.download_allower = function (file) {
        chrome.downloads.pause(file.id);
        console.log('Pausada');

        if (url_block(file) || size_block(file)) {
            chrome.downloads.resume(file.id);
            console.log('resumida');

            //TODO add pop up info
        }
        else {
            chrome.downloads.cancel(file.id);
            console.log('Cancelada');
        }
    }

    DB.prototype.add_listener = function () {
        var that = this;
        this.urls = [];
        chrome.storage.local.get(['dwl_enabled', 'dwl_type', 'dwl_url_list', 'dwl_max_size'], function (data) {
            chrome.downloads.onCreated.removeListener(dwl_listener);
            that.enabled = data.dwl_enabled;
            if (!that.enabled) {
                return;
            }
            that.type = data.dwl_type;
            data.dwl_url_list.forEach(item => that.urls.push(url_regex(item)));
            that.max_size = data.dwl_max_size;
            if ((Array.isArray(that.urls) && that.urls.length) || that.max_size) {
                chrome.downloads.onCreated.addListener(dwl_listener);
            }
        });
    }
})(DownloadBackground);

var dwl_background = new DownloadBackground();

var dwl_listener = function (file) {
    dwl_background.block_action(file);
}