class Import {

    static get_file_extension(filename) {
        return filename.split('.').pop();
    }

    static import_data_remote() {
        RemoteBackground.getInstance().ajax({
            method: "GET",
            url: IMPORT.REMOTE.URL_IMPORT,
        }).then(function(data) {
            try {
                if (data) {
                    Controller.getInstance().import(JSON.stringify(data), '.json', false);
                }
            } catch (e) {
                Logger.getInstance().log(e.stack, LOGGER.DB.LOG_DEV);
            }
        });
    }
}