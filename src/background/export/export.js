class Export {
    static export_items(query = null, filename = undefined) {
        chrome.storage.local.get(query, function(data) {
            Export.exporter(data, filename);
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
}