var exp_that = undefined;

function ExportCardController(section, dB, num) {
    this.section = section;
    this.charged = false;
    this.dB = dB;
    this.num = num;
    exp_that = this;
}

(function(ECC, undefined) {


    ECC.prototype.init_components = function(container = undefined) {
        if (this.charged)
            return;
        this.charged = true;
        exp_that = this;
        add_card(this.section, this.num, container);

        var exp_btn = create_button(this.section + '-export', {
            classList: ['btn-default', 'btn-md'],
            innerHTML: 'Export'
        });

        exp_btn.id = this.section + '-export';

        $('#' + this.section + '-header' + '-' + exp_that.num).html('Exportació');
        $('#' + this.section + '-text' + '-' + exp_that.num).addClass('text-center').html(exp_btn);
        $('#' + exp_btn.id).click(this.send_export_msg);
    }


    ECC.prototype.send_export_msg = function() {
        chrome.runtime.sendMessage(chrome.runtime.id, { id: exp_that.dB.REQUEST.EXPORT });
    }
})(ExportCardController);