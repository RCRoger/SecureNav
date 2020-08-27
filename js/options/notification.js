var not_that = undefined;

function NotiCardController(section, dB, num) {
    this.section = section;
    this.charged = false;
    this.dB = dB;
    this.num = num;
    not_that = this;
}

(function(NCC, undefined) {
    NCC.prototype.show = function(data) {
        if (this instanceof NCC) {
            not_that = this;
        }
        this.change_bell(data.show_info);
        $('#' + not_that.section + '-enabled' + '-' + not_that.num).prop('checked', data.show_info);

        getMessage(data.show_info ? "enabled" : "disabled", not_that.section + "-bell-label");
    }
    NCC.prototype.init_components = function(container = undefined) {
        if (this.charged)
            return;
        this.charged = true;
        not_that = this;
        add_card(this.section, this.num, container);
        var notification_icon = create_bell_icon(this.section + 'not-bell');
        var a = create_elem('a');
        a.id = this.section + '-bell-label';
        var enabled_check = create_checkbox(this.section, 'enabled', this.num, []);
        $('#' + this.section + '-header' + '-' + not_that.num).html(enabled_check);
        $('#' + this.section + '-enabled-label' + '-' + not_that.num).removeClass().addClass('ml-0').append(notification_icon, '&nbsp;', a);
        $('#' + this.section + '-enabled' + '-' + not_that.num).change(this.save_enabled);


        var a = document.createElement('a');
        a.classList.add('float-left');
        a.id = this.section + "-title-a" + '-' + not_that.num;
        $('#' + this.section + '-title' + '-' + not_that.num).append(a);
        getMessage("notification_title", this.section + "-title-a" + '-' + not_that.num);

    }

    NCC.prototype.show_events = function() {

    }
    NCC.prototype.change_bell = function(checked) {
        if (checked)
            $('#' + not_that.section + '-container .fa-bell-slash').addClass('fa-bell').removeClass('fa-bell-slash').parent().removeClass('text-muted').addClass('amber-text');
        else {
            $('#' + not_that.section + '-container .fa-bell').addClass('fa-bell-slash').removeClass('fa-bell').parent().removeClass('amber-text').addClass('text-muted');;
        }

    }

    NCC.prototype.save_enabled = function() {
        not_that.change_bell(this.checked);
        getMessage(this.checked ? "enabled" : "disabled", not_that.section + "-bell-label");
        chrome.runtime.sendMessage(chrome.runtime.id, { id: not_that.dB.REQUEST.SET_SHOW_INFO, data: this.checked });
    }


})(NotiCardController);