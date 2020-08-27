var exp_that = undefined;

function ExportCardController(section, dB, num) {
    this.section = section;
    this.charged = false;
    this.dB = dB;
    this.num;
    exp_that = this;
}

(function(ECC, undefined) {
    ECC.prototype.show = function(data) {
        if (this instanceof ExportCardController) {
            exp_that = this;
        }


    }

    ECC.prototype.trash_event = function() {}
    ECC.prototype.trash_action = function() {}
    ECC.prototype.init_components = function(container = undefined) {
        if (this.charged)
            return;
        this.charged = true;
        exp_that = this;
        add_card(this.section, this.num, container);
        $('#' + this.section + '-header' + '-' + exp_that.num).html('Exportació');
        $('#' + this.section + '-text' + '-' + exp_that.num).addClass('text-center').html(create_button(this.section + '-export', {
            classList: ['btn-primary', 'btn-md'],
            innerHTML: 'Export'
        }));
    }


    ECC.prototype.save_url_enabled = function() {
        getMessage(this.checked ? "enabled" : "disabled", exp_that.section + "-enabled-label-1");
        chrome.runtime.sendMessage(chrome.runtime.id, { id: exp_that.dB.REQUEST.URL_SET_ENABLED, data: this.checked });
    }
})(ExportCardController);