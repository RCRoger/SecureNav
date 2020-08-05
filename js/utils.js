function getMessage(msg, item) {
    var message = chrome.i18n.getMessage(msg);
    document.getElementById(item).innerHTML = message;
}