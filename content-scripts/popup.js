function PopUpScripts() {

}

(function (PC, undefined) {

    PC.prototype.request = function (request) {
        switch (request.id) {
            case POP_UP.REQUEST.SHOW_INFO:
                this.create_info_msg(request.data);
        }
    }

    PC.prototype.create_info_msg = function (data) {

        var info_icon_params = {
            a:{
                classList: ['text-dark']
            },
            icon:{
                classList: ['fas', 'fa-info-circle', 'fa-lg']
            }
        }

        var params = {
            content: {
                classList: ['modal-notify', 'modal-info']
            },
            header: {
                children: [create_icon(info_icon_params), create_exit_btn()]
            },
            body: {
                classList: ['text-info'],
                innerHTML: data
            },
            footer: {
                innerHTML: 'OK crack'
            }
        };

        var id = 'pop_up-info';

        var $id = '#' + id;
        var modal = create_modal(id, params);
        $('body').append($(modal));

        $($id).modal('show');

        $($id).on('hide.bs.modal', function () {
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


var desu = function (request, sender, response) {
    if (request && (request.id.toString().includes('pop_up')))
        response(popUpController.request(request));
    return true;
}

chrome.runtime.onMessage.addListener(desu);