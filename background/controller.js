class Controller {
    constructor() {
        this.init_services();
    }

    init_services() {
        this.logger = Logger.getInstance();
        this.dwl = DownloadBackground.getInstance();
        this.pg = PageBackground.getInstance();
        this.eme = EmergentBackground.getInstance();
        chrome.runtime.onMessage.addListener(request);
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
        return this.dwl.blocks + this.pg.blocks;
    }

    count_checks() {
        return this.dwl.checks + this.pg.checks;
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
                this.dwl.import(request.data.data, request.data.file, request.data.override);
                this.dwl.import(request.data.data, request.data.file, request.data.override);
                break;
            default:
                this.logger.log('invalid_format' + ' ' + request.id, LOGGER.DB.LOG_DEV);
                PopUpController.show_error('invalid_format');
                return;
        }
    }

    request(request, sender, response) {
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
        return true;
    }
}

var controller = new Controller();

function request(request, sender, response) {
    controller.request(request, sender, response);
}