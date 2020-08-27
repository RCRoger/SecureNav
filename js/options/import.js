var imp_that = undefined;

function ImportCardController(section, dB, num) {
    this.section = section;
    this.charged = false;
    this.dB = dB;
    this.num;
    imp_that = this;
}

(function(ECC, undefined) {
    ECC.prototype.show = function(data) {
        if (this instanceof ImportCardController) {
            imp_that = this;
        }


    }

    ECC.prototype.trash_event = function() {}
    ECC.prototype.trash_action = function() {}
    ECC.prototype.init_components = function(container = undefined) {
        if (this.charged)
            return;
        this.charged = true;
        imp_that = this;
        add_card(this.section, this.num, container);
        $('#' + this.section + '-header' + '-' + imp_that.num).html('Exportació');
        $('#' + this.section + '-text' + '-' + imp_that.num).addClass('text-center').html(create_button(this.section + '-import', {
            classList: ['btn-primary', 'btn-md'],
            innerHTML: 'Impo'
        }));
    }


    ECC.prototype.save_url_enabled = function() {
        getMessage(this.checked ? "enabled" : "disabled", imp_that.section + "-enabled-label-1");
        chrome.runtime.sendMessage(chrome.runtime.id, { id: imp_that.dB.REQUEST.URL_SET_ENABLED, data: this.checked });
    }
})(ImportCardController);