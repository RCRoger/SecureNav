function PopUpScripts() {

}

(function (PC, undefined) {

    PC.prototype.request = function (request) {
        switch (request.id) {
            case POP_UP.REQUEST.SHOW_INFO:
                this.create_info_msg(request.data);
        }
    }

    PC.prototype.get_msg = function(text){
        var split = text.split(' ');
        var msg = '';
        split.forEach(item => {
            msg += getMessageStr(item) + ' ';
        });
        return msg;
    }

    PC.prototype.create_info_msg = function (data) {

        var btn_params = {
            classList:['btn-sm', 'btn-info'],
            attributes: [{key: 'data-dismiss', value: 'modal'}],
            innerHTML: 'OK'
        }

        var a_params = {
            classList:['text-sm', 'text-muted'],
            innerHTML: getMessageStr('unable_notifications'),
            attributes: [{key: 'style', value: 'font-size:8px;'}],
        }

        var params = {
            content: {
                classList: ['modal-notify', 'modal-info']
            },
            header: {
                classList:['text-uppercase'],
                innerHTML: 'Info'
            },
            body: {
                classList: ['text-info'],
                innerHTML: this.get_msg(data)
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