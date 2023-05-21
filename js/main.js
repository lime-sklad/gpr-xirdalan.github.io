$(document).ready(function(){
    $('.btn').click(function() {

        $('.preloader').removeClass('hide');

        $('.result-list').html('');

        let value = $('.input').val();
        value = new RegExp(value, "i");
        $.getJSON('js/ADLARI_DEYISEN_MEHSULLAR.json', function(data){
            $.each(data, function(key, val){
                if((val['MƏHSULUN KOHNE ADI'].search(value) != -1)) {
                    
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
                }
            });

            $('.preloader').addClass('hide');

        });

    });
});