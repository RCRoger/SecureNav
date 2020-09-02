var imp_that = undefined;

function ImportCardController(section, dB, num, callback) {
    this.section = section;
    this.charged = false;
    this.dB = dB;
    this.num = num;
    this.callback = callback;
    imp_that = this;
}

(function(ICC, undefined) {

    ICC.prototype.init_components = function(container = undefined, onlyJSON = false) {
        if (this.charged)
            return;
        this.charged = true;
        imp_that = this;
        add_card(this.section, this.num, container);
        $('#' + this.section + '-header' + '-' + imp_that.num).html('Importació');

        var accept = { key: 'accept', value: '.txt, .json, .csv' };
        if (onlyJSON)
            accept = { key: 'accept', value: '.json' }

        var input = create_elem('input', {
            classList: ['invisible'],
            attributes: [{
                key: 'type',
                value: 'file'
            }, accept, { key: 'style', value: 'position: absolute;' }]
        });
        input.id = this.section + '-import-button';
        var label = create_elem('label', {
            classList: ['btn', 'btn-md', 'btn-default'],
            attributes: [
                { key: 'for', value: input.id }
            ],
            innerHTML: getMessageStr('import')
        });

        var override = create_checkbox(this.section, 'imp', this.num, ['custom-control', 'custom-checkbox', 'float-right']);

        var div_input = create_elem('div', {
            children: [input, label]
        });

        var help_json = create_elem('a', {
            classList: ['text-default'],
            attributes: [{ key: 'data-toggle', value: 'tooltip' }, { key: 'title', value: getMessageStr('help_json') }],
            innerHTML: 'JSON'
        });
        var help_csv = create_elem('a', {
            classList: ['text-default'],
            attributes: [{ key: 'data-toggle', value: 'tooltip' }, { key: 'title', value: getMessageStr('help_csv') }],
            innerHTML: 'csv'
        });
        var help_txt = create_elem('a', {
            classList: ['text-default'],
            attributes: [{ key: 'data-toggle', value: 'tooltip' }, { key: 'title', value: getMessageStr('help_txt') }],
            innerHTML: 'txt'
        });

        var children = [
            document.createTextNode(getMessageStr('import_title')), create_elem('br')
        ];
        if (onlyJSON) {
            children.push(help_json);
        } else {
            children.push(help_json);
            children.push(document.createTextNode(', '));
            children.push(help_csv);
            children.push(document.createTextNode(', '));
            children.push(help_txt);
        }

        var div_title = create_elem('div', {
            children: children
        });
        $('#' + this.section + '-header' + '-' + imp_that.num).append(override);
        $('#' + this.section + '-title' + '-' + imp_that.num).html(div_title);
        $('#' + this.section + '-text' + '-' + imp_that.num).addClass('text-center').html(div_input);
        $('#' + this.section + "-imp-label-" + this.num).html(getMessageStr('override'));
        $('[data-toggle="tooltip"]').tooltip();

        $('#' + input.id).change(function(e) {
            var override = $('#' + imp_that.section + "-imp-" + imp_that.num).is(':checked');
            if (this.files.length == 1) {
                load_file(this.files[0], override, imp_that.send_import);
                this.value = '';
            }
        });
    }


    ICC.prototype.send_import = function(data, file, override) {
        chrome.runtime.sendMessage(chrome.runtime.id, { id: imp_that.dB.REQUEST.IMPORT, data: { data: data, file: file.name, override: override } }, imp_that.callback);
    }
})(ImportCardController);