$(document).ready(function() {
    let card = [];
    let products = [];
    let category = [];
    let selectedCategory = '';
    let batchSize = 20;
    let currentIndex = 0;
    let isLoading = false;

    $.getJSON("products.json?v=107", function(data) {
      products = data.products;
      getCategoryList();

      loadProducts();
    });



    $(window).on("scroll", function () {
      if($(window).scrollTop() > 100) {
        $('.search-container').addClass('search-container-scrolled');
      } else { 
        $('.search-container').removeClass('search-container-scrolled');
      }

      if (!isLoading && $(window).scrollTop() + $(window).height() >= $(document).height() - 400) {
        if (currentIndex < products.length) {
          isLoading = true;
          setTimeout(() => {
            loadProducts();
          }, 400);
        }
      }
    });


    $(document).on('input', '.search-json', function() {
       let $delay = 450;
       let vals = $(this).val().toLowerCase().trim();


       if(vals.length > 3) {
         clearTimeout($(this).data('timer'));

         $(this).data('timer', setTimeout(function() {
            let jsonSearchArr = [];

            jsonSearchArr = products.filter(
                record => record.name.toLowerCase().includes(vals) 
            );

             if(jsonSearchArr.length > 0) {
              console.log(jsonSearchArr);
               selectedCategory = false;

               $(".products-list").html('');
               currentIndex = 0;
               loadProducts(jsonSearchArr);
             }

         }, $delay));

       }
    });


    $(document).on('change', '.select-category', function() {
      let val = $(this).val();

      selectCategory(val);

      scrollTop();
    });


    $(document).on('click', '.open-add-to-card-modal', function() {
        $('.add-to-card-modal').addClass('display-flex');

        let $this = $(this).closest('.products-card');

        let imageSrc = $this.find('.prodcuts-image > img').attr('src');
        let productName = $this.find('.products-name').text();
        let productPrice = $this.find('.products-price').text();
        let id = $this.find('.id').val();

        $('.cart-product-image > img').attr('src', imageSrc);
        
        $('.card-product-name').html(productName);
        
        $('.cart-product-price').text(productPrice);

        $('.cart-id').val(id);
        
        $('.count').focus();
    });


    $(document).on('click', '.add-to-card', function() {
        closeCartModal();

        let $this = $(this).closest('.add-to-card-modal');

        let imageSrc = $this.find('.cart-product-image > img').attr('src');
        let productName = $this.find('.card-product-name').text();
        let productPrice = $this.find('.cart-product-price').text();
        let count = $this.find('.count').val();

        if(!count || count <=0) {
          count = 1;
        }

        let getId = $this.find('.cart-id').val();

        if (!card[getId]) {
          card[getId] = [];
        }  

        card[getId] = {
          "imageSrc": imageSrc,
          "productName": productName,
          "productPrice": productPrice,
          "count": count,
          "getId": getId
        };


        $('.count').val('');

        $('.showNotice').addClass('active');

        setTimeout(function(){
          $('.showNotice').removeClass('active');
       }, 1000);

        sumCardTotal();
    });


    $(document).on('click', '.close-add-card-modal', function() {
      closeCartModal();
    });


    $(document).on('click', '.close-card-list', function() {
      $('.cart-list-modal').removeClass(['display-flex', 'active']);
    });


    $(document).on('click', '.openCart', function() {
      $('.cart-list').html('');

      $('.cart-list-modal').addClass(['display-flex', 'active']);

      // {imageSrc: '/img/3.jpg', productName: '3 Qulaqlıq BT Euroacs EU-HS30 Black', productPrice: '0.60₼', count: '23', getId: 'SSW3767'}
      Object.keys(card).map(function(objectKey, index) {
          var row = card[objectKey];

          $('.cart-list').append(`
            <div class="cart-list-item">
               <div class="cart-list-image">
                <img src="${row.imageSrc}">
               </div>

               <div class="cart-list-info">
                  <span class="delete-product-at-card">Sil</span>

                  <span class="cart-list-item-name">${row.productName}</span>
                  <span class="cart-list-item-productPrice">${row.productPrice}</span>

                  <div class="cart-list-info-count-group">
                    <span class="cart-label">Say:</span>
                    <input type="text" class="input cart-list-item-count" value="${row.count}">

                    <p class="sum">
                         <span class="sum-title">Toplam:</span> 
                        <span class="cart-list-item-total">${sumItemTotal(row.count, row.productPrice)}₼</span> 
                      </p>
                  </div>

                  <input type="hidden" class="cart-list-item-id" value="${row.getId}">
               </div>
            </div>
          `);
      });
    });

    $(document).on('click', '.delete-product-at-card', function() {
       let id = $(this).closest('.cart-list-info').find('.cart-list-item-id').val();

       delete card[id];

       $(this).closest('.cart-list-item').remove();

       sumCardTotal();
    });


    $(document).on('click', '.send-cart', function() {
      let strs = '';
    let orderId = Date.now();


        // **Тестируем**
      order = {
          id: orderId,
          card: []
      };


      Object.keys(card).map(function(objectKey, index) {
          var row = card[objectKey];

          strs = strs + `${row.productName} - ${row.count} ədəd \n \n`;

          row.productPrice = row.productPrice.replace('₼', ' AZN')

          order.card.push(row);
      });      

        strs = strs + `https://gpr-xirdalan.github.io/orderView.html?orderId=${orderId}`;

        $.ajax({
          url: 'https://gpr-xirdalan-github-io.vercel.app/api/saveOrder',
          type: 'POST',
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify(order),
          beforeSend: () => {
            $('.preloader').removeClass('hide');
          },
          success: () => {
            $('.preloader').addClass('hide');

            let encodedStrs = encodeURIComponent(strs); 

            let url = `https://wa.me/994504213635?text=${encodedStrs}`;

            window.location.href = url;            
          }
        });
    });


    function closeCartModal() {
      $('.add-to-card-modal').removeClass('display-flex');
    } 

    $(document).on('input', '.cart-list-item-count', function() {
       let $delay = 450;
       let getId = $(this).closest('.cart-list-item').find('.cart-list-item-id').val();
       let newCount = $(this).val();

       clearTimeout($(this).data('timer'));
      
       $(this).data('timer', setTimeout(function(){
         card[getId].count = newCount;
          sumCardTotal(); 

       }, $delay));



       $(this).closest('.cart-list-item').find('.cart-list-item-total').html(`${sumItemTotal(newCount, card[getId].productPrice)}`);
      
    });


  function sumItemTotal(count, price) {
    price = price.replace('₼', '');
    return (count * price).toFixed(2);
  }


  function loadProducts(customData = []) {
    let filtredData = [];

    if (currentIndex >= products.length) return;

    let endIndex = Math.min(currentIndex + batchSize, products.length);

    if(selectedCategory) {
      filtredData = products.filter(item => item.category == selectedCategory);
    } else {
      filtredData = products;
    }

    if(customData.length > 0) {
       filtredData = customData;
    }

    let batch = filtredData.slice(currentIndex, endIndex);

    promises = [];

    $.each(batch, function(key, val) {
      promises.push(appendProductCard(val));
    });

    Promise.all(promises).then(() => {
        isLoading = false;
        currentIndex = endIndex;
    });    
  }


  function prepareProductCardTpl(product) {
    return `
        <div class="products-card">
          <span class="product-brand">${product.brand ?? ''}</span>   
          <div class="prodcuts-image">
            <img src="${product.imageSrc}" alt="">
          </div>
          <span class="products-name">${product.name}</span>
          <span class="products-price">${product.price}₼</span>
          <button class="button open-add-to-card-modal">Səbətə əlavə et</button>

          <input type="hidden" class="id" value="${generateRandomId()}">
        </div>
    `;
  }

  function prependProductCard(product) {
    $('.products-list').prepend(prepareProductCardTpl(product));
  }

  function appendProductCard(product) {
        return new Promise((resolve) => {
            $('.products-list').append(prepareProductCardTpl(product));
            resolve(); // Сообщаем, что элемент добавлен
        });
  }

  function insertProductCard(product) {
    $('.products-list').html(prepareProductCardTpl(product));
  }    


  function getCategoryList() {
    let selected = '';

    $.each(products, function(key, val) {
      if(!category.includes(val.category)) {
        category.push(val.category);
      }  
    });

    selectedRandomCategory();

    $.each(category, function(key, val) { 
      if(selectedCategory && val === selectedCategory) {
        selected = 'selected';
      }


      $('.select-category').append(`
        <option class="select-category-option" ${selected} value="${val}">${val}</option>
      `);

      selected = '';
    });
  }


  function selectCategory(val) {
    if(val == 'all') {
      selectedCategory = false;
    } else {
      selectedCategory = val;
    }

    $(".products-list").html('');
    currentIndex = 0;
    loadProducts();
  }

function generateRandomId() {
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let numbers = "0123456789";

    let randomLetters = Array.from({length: 3}, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    let randomNumbers = Array.from({length: 4}, () => numbers[Math.floor(Math.random() * numbers.length)]).join('');

    return randomLetters + randomNumbers;
}

function sumCardTotal() {
  let sumCard = [];

  Object.keys(card).map(function(objectKey) {
    var row = card[objectKey];
    sumCard.push(parseFloat(row.productPrice) * row.count);
  });

  $('.sum-card').text(sumCard.reduce((partialSum, a) => partialSum + a, 0).toFixed(2)); 
}


function selectedRandomCategory() {
  selectedCategory = category[Math.floor(Math.random() * category.length)];
}


function scrollTop() {
  var $body = $("html, body, .container, .content");
   $body.stop().animate({scrollTop:0}, 500, 'swing', function(evt) {
   });
}


});


