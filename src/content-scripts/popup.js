function PopUpScripts() {

}

(function(PC, undefined) {

    PC.prototype.request = function(request) {
        switch (request.id) {
            case POP_UP.REQUEST.SHOW_INFO:
                this.create_info_msg(request.data);
                break;
            case POP_UP.REQUEST.SHOW_ERROR:
                this.create_error_msg(request.data);
                break;
            case POP_UP.REQUEST.SHOW_ASK:
                this.create_ask_msg(request.data);
                break;
        }
    }

    PC.prototype.create_info_msg = function(data) {

        var btn_params = {
            classList: ['btn-sm', 'btn-info'],
            attributes: [{ key: 'data-dismiss', value: 'modal' }],
            innerHTML: 'OK'
        }

        var a_params = {
            classList: ['text-sm', 'text-muted'],
            innerHTML: getMessageStr('unable_notifications'),
            attributes: [{ key: 'style', value: 'font-size:8px;' }],
        }

        var params = {
            content: {
                classList: ['modal-notify', 'modal-info']
            },
            header: {
                classList: ['text-uppercase'],
                innerHTML: 'Info'
            },
            body: {
                classList: ['text-info'],
                innerHTML: get_msg(data)
            },
            footer: {
                children: [create_elem('a', a_params), create_button('close', btn_params)]
            }
        };


        var id = 'pop_up-info';
        var $id = '#' + id;
        var modal = create_modal(id, params);
        $('body').append($(modal));

        $($id).modal('show');

        $($id).on('hide.bs.modal', function() {
            $($id).remove();
        });
    }

    PC.prototype.create_ask_msg = function(data) {
        this.id = data.req;
        this.url = data.url;
        this.host = data.host;

        var btn_ok_params = {
            classList: ['btn-sm', 'btn-danger'],
            attributes: [{ key: 'data-dismiss', value: 'modal' }, { key: 'id', value: 'btn-ok' }],
            innerHTML: getMessageStr('continue')
        }

        var btn_no_params = {
            classList: ['btn-sm', 'btn-success'],
            attributes: [{ key: 'data-dismiss', value: 'modal' }, { key: 'id', value: 'btn-no' }],
            innerHTML: getMessageStr('cancel')
        }



        var a_params = {
            classList: ['text-sm', 'text-muted'],
            innerHTML: getMessageStr('unable_notifications'),
            attributes: [{ key: 'style', value: 'font-size:8px;' }],
        }

        var params = {
            content: {
                classList: ['modal-notify', 'modal-info']
            },
            header: {
                classList: ['text-uppercase'],
                innerHTML: 'Info'
            },
            body: {
                classList: ['text-info'],
                innerHTML: get_msg(data.data)
            },
            footer: {
                children: [create_elem('a', a_params), create_button('OK', btn_ok_params), create_button('NOOK', btn_no_params)]
            }
        };


        var id = 'pop_up-info';
        var $id = '#' + id;
        var modal = create_modal(id, params);
        $('body').append($(modal));

        $($id).modal('show');

        $('#btn-ok').click(ask_ok);
        $('#btn-no').click(ask_no);
        $($id).on('hide.bs.modal', function() {
            window.setTimeout(function() {
                window.close();
            }, 1000);
        });
    }


    PC.prototype.send_url = function(action) {
        var data = { action: action, url: this.host };
        var that = this;
        chrome.runtime.sendMessage(chrome.runtime.id, { id: this.id, data: data }, function() {
            window.location.replace(that.url);
        });
    }

    PC.prototype.create_error_msg = function(data) {

        var btn_params = {
            classList: ['btn-sm', 'btn-danger'],
            attributes: [{ key: 'data-dismiss', value: 'modal' }],
            innerHTML: 'OK'
        }

        var params = {
            content: {
                classList: ['modal-notify', 'modal-danger']
            },
            header: {
                classList: ['text-uppercase'],
                innerHTML: 'Error'
            },
            body: {
                classList: ['text-danger'],
                innerHTML: get_msg(data)
            },
            footer: {
                children: [create_button('close', btn_params)]
            }
        };


        var id = 'pop_up-error';
        var $id = '#' + id;
        var modal = create_modal(id, params);
        $('body').append($(modal));

        $($id).modal('show');

        $($id).on('hide.bs.modal', function() {
            $($id).remove();
        });
    }



    function create_modal(id, params) {
        var modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        add_params(modal, params.modal);
        modal.setAttribute('role', 'dialog');


        var dialog = document.createElement('div');
        dialog.classList.add('modal-dialog');
        add_params(dialog, params.dialog);
        modal.appendChild(dialog);

        var content = document.createElement('div');
        content.classList.add('modal-content');
        add_params(content, params.content);
        dialog.appendChild(content);



        var header = document.createElement('div');
        header.classList.add('modal-header');
        add_params(header, params.header);
        content.appendChild(header);

        var body = document.createElement('div');
        body.classList.add('modal-body');
        add_params(body, params.body);
        content.appendChild(body);

        var footer = document.createElement('div');
        footer.classList.add('modal-footer');
        add_params(footer, params.footer);
        content.appendChild(footer);

        modal.id = id;
        dialog.id = id + '-dialog';
        content.id = id + '-content';
        header.id = id + '-header';
        body.id = id + '-body';
        footer.id = id + '-footer';

        return modal;
    }


})(PopUpScripts);

var popUpController = new PopUpScripts();

function ask_no() {
    popUpController.send_url(2);
}

function ask_ok() {
    popUpController.send_url(0);
}


var desu = function(request, sender, response) {
    if (request && (request.id.toString().includes('pop_up')))
        response(popUpController.request(request));
    return true;
}

chrome.runtime.onMessage.addListener(desu);