$(document).ready(function() {

  $('.title').each(function(k, v) {
    $(this).attr('id', `anchor${k}`);


    $('.menu-content').append(`
      <div class="menu-item" data-anchor="anchor${k}">${$(this).text()}</div>
    `);
  });


  $(document).on('click', '.menu-item', function() {
     $('html, body').animate({
        scrollTop: $(`.title#${$(this).attr('data-anchor')}`).offset().top
    }, 1000);

     $('.menu-list').hide(300);
    $('body').removeClass('overflow-hidden');
  });


  $('.menu-button').click(function() {
    $('.menu-list').show(300);
    $('body').addClass('overflow-hidden');
  });

  $('.menu-controll').click(function() {
    $('.menu-list').hide(300);
    $('body').removeClass('overflow-hidden');
  });

});


