var imp_that = undefined;

function ImportCardController(section, dB, num) {
    this.section = section;
    this.charged = false;
    this.dB = dB;
    this.num = num;
    imp_that = this;
}

(function(ICC, undefined) {

    ICC.prototype.init_components = function(callback, container = undefined) {
        if (this.charged)
            return;
        this.charged = true;
        imp_that = this;
        add_card(this.section, this.num, container);
        $('#' + this.section + '-header' + '-' + imp_that.num).html('Importació');

        var input = create_elem('input', {
            classList: ['invisible'],
            attributes: [{
                key: 'type',
                value: 'file'
            }, { key: 'accept', value: '.txt, .json, .csv' }, { key: 'style', value: 'position: absolute;' }]
        });
        input.id = this.section + '-import-button';
        var label = create_elem('label', {
            classList: ['btn', 'btn-md', 'btn-default'],
            attributes: [
                { key: 'for', value: input.id }
            ],
            innerHTML: 'Import'
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

        var div_title = create_elem('div', {
            children: [
                document.createTextNode(getMessageStr('import_title')), create_elem('br'), help_json, document.createTextNode(', '), help_csv, document.createTextNode(', '), help_txt
            ]
        });
        $('#' + this.section + '-header' + '-' + imp_that.num).append(override);
        $('#' + this.section + '-title' + '-' + imp_that.num).html(div_title);
        $('#' + this.section + '-text' + '-' + imp_that.num).addClass('text-center').html(div_input);
        $('#' + this.section + "-imp-label-" + this.num).html(getMessageStr('override'));
        $('[data-toggle="tooltip"]').tooltip();

        $('#' + input.id).change(function(e) {
            var override = $('#' + imp_that.section + "-imp-" + imp_that.num).is(':checked');
            if (this.files.length == 1) {
                load_file(this.files[0], override, callback);
                this.value = '';
            }
        });
    }


    ICC.prototype.save_url_enabled = function() {
        chrome.runtime.sendMessage(chrome.runtime.id, { id: imp_that.dB.REQUEST.URL_SET_ENABLED, data: this.checked });
    }
})(ImportCardController);