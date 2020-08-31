class Controller {

    init_services() {
        try {
            this.logger = Logger.getInstance();
            this.dwl = DownloadBackground.getInstance();
            this.pg = PageBackground.getInstance();
            this.eme = EmergentBackground.getInstance();
            chrome.runtime.onMessage.addListener(request);
        } catch (e) {
            this.logger.log(e.message, LOGGER.DB.LOG_DEV);
            this.restart_services();
        }
    }


    restart_services() {
        Logger.restart();
        DownloadBackground.restart();
        PageBackground.restart();
        EmergentBackground.restart();
        chrome.runtime.onMessage.removeListener(request);
        this.init_services();
    }

    count_blocks() {
        return this.dwl.blocks + this.pg.blocks + this.eme.blocks;
    }

    count_checks() {
        return this.dwl.checks + this.pg.checks + this.eme.blocks;
    }

    get_count() {
        return { blocks: this.count_blocks(), checks: this.count_checks() }
    }

    request_ctrl(request) {
        switch (request.id) {
            case CONTROLLER.REQUEST.GET_DATA:
                return this.get_count();
            case CONTROLLER.REQUEST.EXPORT:
                Export.export_items();
                break;
            case CONTROLLER.REQUEST.IMPORT:
                this.import(request.data.data, request.data.file, request.data.override);
                break;
            default:
                this.logger.log('invalid_format' + ' ' + request.id, LOGGER.DB.LOG_DEV);
                PopUpController.show_error('invalid_format');
                return;
        }
    }

    import (data, file, override) {
        if (Import.get_file_ext(file) == 'json') {
            this.dwl.import(data, file, override);
            this.pg.import(data, file, override);
            this.eme.import(data, file, override);
        } else {
            this.logger.log('invalid_format' + ' ' + request.id, LOGGER.DB.LOG_DEV);
            PopUpController.show_error('invalid_format');
        }
    }

    request(request, sender, response) {
        try {
            if (request && (request.id.toString().includes('dwl')))
                response(this.dwl.request(request));
            else if (request && (request.id.toString().includes('pg')))
                response(this.pg.request(request));
            else if (request && (request.id.toString().includes('log')))
                response(this.logger.request(request));
            else if (request && (request.id.toString().includes('ctr')))
                response(this.request_ctrl(request));
            else if (request && (request.id.toString().includes('eme')))
                response(this.eme.request(request));
        } catch (e) {
            this.logger.log(e.message, LOGGER.DB.LOG_DEV);
        }
        return true;
    }

    static getInstance() {
        if (!Controller.instance)
            Controller.instance = new Controller();
        return Controller.instance;
    }
}

function request(request, sender, response) {
    Controller.getInstance().request(request, sender, response);
}