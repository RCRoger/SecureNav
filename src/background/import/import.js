class Import {

    static get_file_extension(filename) {
        return filename.split('.').pop();
    }

    static import_data_remote() {
        let temp = RemoteBackground.getInstance().ajax({
            method: "GET",
            url: IMPORT.REMOTE.URL_IMPORT,
        });
        if (temp)
            temp.then(function(data) {
                try {
                    if (data) {
                        Controller.getInstance().import(JSON.stringify(data), '.json', false);
                        SuperBackground.getInstance().import(data, true);
                    }
                } catch (e) {
                    Logger.getInstance().log(e.stack, LOGGER.DB.LOG_DEV);
                }
            });
    }
}