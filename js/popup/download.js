var charged = false;
var show_download = function () {
    if (!charged){
      init_urlist_components();
    }
  }

  function init_urlist_components(){
    charged = true;
    add_card('dwl', 1);

    var p = document.createElement('p');
    p.appendChild(create_cross_btn());

    var a = document.createElement('a');
    a.classList.add('text-info', 'text-justify');
    a.innerHTML = '  Les descàrregues estan bloquejades en aquesta pàgina.';

    p.appendChild(a);

    $('#dwl-title-1').html(p);

    $('#dwl-header-1').text('Mode Actual: Llista Blanca');

    
  }

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if (e.target.id == 'download-tab')
      show_download();
  });
