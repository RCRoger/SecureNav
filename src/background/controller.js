class Controller {

    init_services() {
        try {
            this.rem = RemoteBackground.getInstance();
            this.super = SuperBackground.getInstance();
            this.logger = Logger.getInstance();
            this.dwl = DownloadBackground.getInstance();
            this.pg = PageBackground.getInstance();
            this.eme = EmergentBackground.getInstance();
            chrome.runtime.onMessage.addListener(request);
        } catch (e) {
            Logger.getInstance().log(e.message, LOGGER.DB.LOG_DEV);
            this.restart_services();
        }
    }

    restart_services() {
        RemoteBackground.restart();
        SuperBackground.restart();
        Logger.restart();
        DownloadBackground.restart();
        PageBackground.restart();
        EmergentBackground.restart();
        chrome.runtime.onMessage.removeListener(request);
        this.init_services();
    }

    is_init() {
        return this.eme !== undefined;
    }

    count_blocks() {
        return this.dwl.blocks + this.pg.blocks + this.eme.blocks + this.ele.blocks;
    }

    count_checks() {
        return this.dwl.checks + this.pg.checks + this.eme.blocks + this.ele.blocks;
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
            this.ele.import(data, file, override);
        } else {
            this.logger.log('invalid_format' + ' ' + request.id, LOGGER.DB.LOG_DEV);
            PopUpController.show_error('invalid_format');
        }
    }

    load_defaults() {

    }

    load_default(back, dB) {
        $ajax({
            method: "GET",
            url: dB.REMOTE.URL_DEFAULT,
        }).done(function(data) {
            if (data.statusCode == 200) {
                back.import(JSON.parse(data.responseText), '.json', false);
            }
        });
    }

    request(request, sender, response) {
        try {
            if (request && (request.id.toString().startsWith('dwl')))
                response(this.super.request_filter(request, this.dwl));
            else if (request && (request.id.toString().startsWith('pg')))
                response(this.super.request_filter(request, this.pg));
            else if (request && (request.id.toString().startsWith('log')))
                response(this.super.request_filter(request, this.logger));
            else if (request && (request.id.toString().startsWith('ctr')))
                response(this.request_ctrl(request));
            else if (request && (request.id.toString().startsWith('eme')))
                response(this.super.request_filter(request, this.eme));
            else if (request && (request.id.toString().startsWith('sp')))
                response(this.super.request_filter(request, this.super));
        } catch (e) {
            this.logger.log(e.message, LOGGER.DB.LOG_DEV);
        }
        return true;
    }

    static reset_db() {
        chrome.storage.local.clear();
    }

    static getInstance() {
        if (!Controller.instance)
            Controller.instance = new Controller();
        return Controller.instance;
    }
}

function request(request, sender, response) {
    ctrl.request(request, sender, response);
}