class Export {
    static export_items(query = null) {
        chrome.storage.local.get(query, exporter);
    }
}

function exporter(data) {
    var result = JSON.stringify(data);

    var url = 'data:application/json;base64,' + btoa(result);
    chrome.downloads.download({
        url: url,
        filename: 'secnav_data.json'
    });
}