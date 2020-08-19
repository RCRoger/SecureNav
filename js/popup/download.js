var charged = false;
var show_download = function () {
    if (!charged){
      init_urlist_components();
    }
    load_info();
  }

  function init_urlist_components(){
    charged = true;
    add_card('dwl', 1);

    var p = document.createElement('p');
    p.id = 'dwl-url-status-p';

    var a = document.createElement('a');
    a.classList.add('text-info', 'text-justify');
    a.id = 'dwl-url-status';

    p.appendChild(a);

    $('#dwl-title-1').html(p);

    $('#dwl-text-1').addClass('text-center');

    
  }

  function show_url_info(data){

    if(!data.enabled){
      $('#dwl-header-1').text( getMessageStr('dwl_url_mode') + getMessageStr('disabled'));
      var btn = create_button('dwl-url-enable');
      btn.classList.add('btn-success');
      btn.innerHTML = getMessageStr('enable');
      $('#dwl-text-1').html(btn);
      $('#dwl-url-enable').click(function(){
        chrome.runtime.sendMessage(chrome.runtime.id, {id: 'dwl_url_set_enabled_lite', data : true }, show_url_info);
      });
      return;
    }

    if(data.type == 0){
      $('#dwl-header-1').text( getMessageStr('dwl_url_mode') + getMessageStr('whitelist'));
    }
    else if(data.type == 1){
      $('#dwl-header-1').text( getMessageStr('dwl_url_mode') + getMessageStr('blacklist'));
    }

    var msg = '';
    var icon = undefined;
    if(data.hasBlock){
      msg = getMessage('dwl_url_status_0', 'dwl-url-status');
      icon = create_cross_btn('dwl_url_status_icon');
    }
    else{
      getMessage('dwl_url_status_1','dwl-url-status');
      icon = create_check_btn('dwl_url_status_icon');
    }
    $('#dwl_url_status_icon').remove();
    $('#dwl-url-status-p').prepend($(icon));

    var button = create_button('dwl-url-block');

    if(data.type == 0){
      if(data.hasBlock){
        button.classList.add('btn-success');
        button.innerHTML = getMessageStr('unblock');
        $('#dwl-text-1').html(button);
      }
      else{
        $('#dwl-text-1').empty();
      }
    }
    else if(data.type == 1){
      if(!data.hasBlock){
        button.classList.add('btn-danger');
        button.innerHTML = getMessageStr('block');
        $('#dwl-text-1').html(button);
      }
      else{
        $('#dwl-text-1').empty();
      }
    }

    $('#dwl-url-block').click(function(){
      chrome.runtime.sendMessage(chrome.runtime.id, {id: 'dwl_add_url', data : {url: data.url}}, show_url_info);
    });

  }

  function load_info(){
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      let url = tabs[0].url;
      chrome.runtime.sendMessage(chrome.runtime.id, { id: 'dwl_url_get_data', data: {'url': url, 'urlFinal': url}}, show_url_info);
  });
  }

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if (e.target.id == 'download-tab')
      show_download();
  });
