
$(document).ready(function(){

    // очищаем результат вывода
    function reset_result() {
        $('.result-list').html('');
    }

    // показывает прелоадер
    function show_preloader() {
        $('.preloader').removeClass('hide');
        
    }
    
    // скрываем прелоадер
    function hide_preloader() {
        $('.preloader').addClass('hide');
    }

    // поиск по старым названиям товара
    function search_products_name(value) {
        show_preloader();

        reset_result();

        value = new RegExp(value, "i");

        $.getJSON('js/ADLARI_DEYISEN_MEHSULLAR.json', function(data) {
            $.each(data, function(key, val){
                if((val['MƏHSULUN KOHNE ADI'].search(value) != -1) || (val['MƏHSULUN YENI ADI'].search(value) != -1) ) {
                    
                    $('.result-list').append(
                    `
                    <div class="result-item">
                        <div class="result-item-u  old-name">
                            <span class="result-item-label">MƏHSULUN KOHNE ADI: </span>
                            <span class="result-item-text old-name">${val['MƏHSULUN KOHNE ADI']}</span>
                        </div>

                        <div class="result-item-u new-name">
                            <span class="result-item-label new-name">MƏHSULUN YENI ADI: </span>
                            <span class="result-item-text old-name">${val['MƏHSULUN YENI ADI']}</span>
                        </div> 
               
                        <div class="result-item-u new-name">
                            <span class="result-item-label new-name">KATEQORIYYASI: </span>
                            <span class="result-item-text old-name">${val['KATEQORIYYASI']}</span>
                        </div>                         
                    </div>                    
                    
                    `
                    );

                    return;
                }
            });

            hide_preloader();
        });

    }


    // поиск по своместимости защитных стекол
    function search_glass(value) {

        show_preloader();

        reset_result();

        value = new RegExp(value, "i");
        let arr = [];

        $.getJSON('js/glass.json', function(data) {
            $.each(data, function(key, val){
                $.each( val, function( glass_id, glass_name ) {
                    if (glass_name.search(value) != -1) {
                        val.filter((eVal) =>  {
                            $('.result-list').append(
                                `
                            <div class="result-item-u">
                                <span class="result-item-text old-name">${eVal}</span>
                            </div>                  
                                
                                `
                                );
                        });
                        return;
                    }
                  });
            });

            hide_preloader();
        });
    }


    $('.search-glass').on('click', function() {
        var value = $('.input').val();

        search_glass(value);
    });



    $('.search-products-name').click(function() {
        let value = $('.input').val();

        search_products_name(value);
    });

});