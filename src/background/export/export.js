class Export {
    static export_items(query = null, filename = undefined) {
        chrome.storage.local.get(query, function(data) {
            Export.exporter(data, filename);
        });
    }

    static export_items_remote(query = null) {
        chrome.storage.local.get(query, function(data) {
            Export.exporter_remote(data);
        });
    }

    static exporter(data, filename = 'secnav_data') {

        if (data[SUPER.DB.PSW]) {
            delete data[SUPER.DB.PSW];
            delete data[SUPER.DB.ENABLED];
        }
        var result = JSON.stringify(data);

        var url = 'data:application/json;base64,' + btoa(result);
        chrome.downloads.download({
            url: url,
            filename: filename + '.json'
        });
    }

    static exporter_remote(data) {
        if (data[SUPER.DB.PSW]) {
            delete data[SUPER.DB.PSW];
            delete data[SUPER.DB.ENABLED];
        }
        var result = { data: JSON.stringify(data) };

        RemoteBackground.getInstance().ajax({
            method: 'POST',
            url: EXPORT.REMOTE.URL_EXPORT,
            data: result
        });
    }
}