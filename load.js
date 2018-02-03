$(function(){
    $('.close_pop').click(function(){
        $('.overlay').fadeOut();
    });
    $('#MainContent').fadeOut(10, 'swing', function(){
        initAjaxCollection();
        $('#MainContent').fadeIn(500, 'linear');
    });
});

function initAjaxCollection(){
    if (location.pathname.indexOf('collections/') >= 0){
        jQuery.getJSON('/collections.json', function(resp) {
           const url = location.pathname + '/products.json';
           jQuery.getJSON(url, function(res) {
                const collections = resp.collections;
                console.log(collections);
                const products = res.products;
                console.log(products);
                $('#product-container').hide();
                renderProducts(products, '#product-container');
                sorting(products, '#shopify-section-collection-template');        
                filter(products, collections, '#filters');
                $('#product-container').fadeIn(500, 'linear', function(){
                    getByPrice = function(val1, val2){
                        var newProducts = [];
                        $('#product-container').fadeOut(500,'linear', function(){
                            $('#product-container').empty();
                            renderProducts(products, '#product-container');
                            sorting(newProducts, '#shopify-section-collection-template');  
                        });                      
                      }
                }); 
            });
        });
    } else {
        console.log('not a collection page');
    }
}
    


function renderProducts(products, appender){
    sorting(products);
    $(appender).fadeOut(function(){
        $(appender).empty();
        products.forEach(function(product, i, products){
            if(product.variants.length > 1){
                var price = '<div class="ajax-view-item__meta"><span class="ajax-product-price__price">$ ' + product.variants[0].price + ' | ' + product.variants.length + ' colors</span></div>';
              }
              else{
                var price = '<div class="ajax-view-item__meta"><span class="ajax-product-price__price">$ ' + product.variants[0].price + '</span></div>';
              }
            var h4 = '<div class="h4 ajax-item__title">'+ product.title +'</div>';
            var link = '<a style="display: block;" href="/products/'+ product.handle +'"> ' + h4 + price + '</a>';
            var quickViewLink = '<a id="quick-link-'+product.id+'" data-pid="' + product.id + '" class="quick-link" href="#"> Quick View </a>';
            
            if (product.images.length > 1){
                  images = product.images;
                  img = [];
                  console.log(images);                  
                  images.forEach(function(image, j, images) {
                      if( image.width < 600){
                        img.push('<a style="display: block;" href="/products/'+ product.handle +'"><img class="grid-view-item__image ajax-img" src="' + image.src + '"></a>'); 
                      }
                  });
                  img = img.join(' ');
                } else {
                    if( product.images[0].width < 600){
                        img = '<a style="display: block;" href="/products/'+ product.handle +'"> <img class="grid-view-item__image ajax-img" src="' + product.images[0].src + '"></a>';
                    }
                }
                  imgContainer = '<div class="grid-view-item__link grid-view-item__image-container center slider">' + img + '</div>';
                  item = '<div class="ajax-grid-view-item text-center">' + imgContainer + link + quickViewLink + '</div>';
                  res = '<div id="product-'+ product.id +'" class="grid__item small--one-whole medium-up--one-third">' + item + '</div>';
                  
                  jQuery(appender).append(res);
                
                $("#quick-link-"+product.id).click(function(e){
                        let id = $(this).data('pid')
                        e.preventDefault()
                                let prod = products.filter(function(item){
                                    if (item.id == id){
                                        return true;
                                    } else {
                                        return false;
                                    }
                                })
                                product = prod[0];
                                  if (product.images.length > 1){
                                    images = product.images;
                                    img = [];
                                    images.forEach(function(image, j, images) {
                                        if (image.width < 600){
                                            img.push('<img class="grid-view-item__image ajax-img" src="' + image.src + '">');                                            
                                        }
                                    });
                                    img = img.join(' ');
                                  } else {
                                    if (product.images[0].width < 600){                                        
                                    img = '<img class="grid-view-item__image ajax-img" src="' + product.images[0].src + '">';
                                    }
                                  }
                                $('.buynow').attr('data-id', product.variants[0].id);
                                $('#quick_v .qv_slider').html(img);
                                $('#quick_v .qv_slider').attr('class', 'qv_slider');
                                $('#quick_v h4').html(product.title + '<span>$'+product.variants[0].price+'</span>');
                                $('#quick_v .qv_desc').html(product.body_html);
                                $('.overlay').fadeIn(500);
                                $('#quick_v').fadeIn(500, function(){
                                    $('#quick_v .qv_slider').not('.slick-initialized').slick({
                                        centerMode: true,
                                        centerPadding: '60px',
                                        slidesToShow: 1,
                                        arrows: false,
                                        dots: true,
                                        autoplay: true,
                                        responsive: [
                                        {
                                            breakpoint: 768,
                                            settings: {
                                            dots: true,
                                            arrows: false,
                                            centerMode: true,
                                            centerPadding: '40px',
                                            slidesToShow: 3
                                            }
                                        },
                                        {
                                            breakpoint: 480,
                                            settings: {
                                            arrows: false,
                                            centerMode: true,
                                            centerPadding: '40px',
                                            slidesToShow: 1
                                            }
                                        }
                                        ]
                                    });

                                $('#quick_v').css( "max-height", $('#quick_v .qv_slider').css( "height" ));
                                $('#quick_v .desc-block').css( "max-height", $('#quick_v .qv_slider').css( "height" ));
                                $('#quick_v .qv_buttons').css( "width", $('#quick_v .desc-block').css( "width" ));
                                });

                                $('body').addClass('disable-scroll');
                                $('.leanmore').attr('href', '/products/' + product.handle);
                                $('.buynow').click(function(){
                                    let prodi = $(this).data('id');
                                    jQuery.post('/cart/add.js', {
                                        quantity: 1,
                                        id: prodi
                                    }, 
                                    function(res){
                                        $('#CartCount span').text(res.quantity);
                                        location.href = '/cart';
                                    }, "json");
                                })
                    });
                $('.overlay').click(function(){
                    $('.overlay').fadeOut(500, function(){
                        $('body').removeClass('disable-scroll');                          
                    });
                    $('#quick_v').fadeOut(500);                
                });
                $('#quick_v svg').click(function(){
                    $('.overlay').fadeOut(500, function(){
                        $('body').removeClass('disable-scroll');                          
                    });
                    $('#quick_v').fadeOut(500);                
                });
        });
        $(appender).fadeIn(25, function(){
            $('.grid-view-item__image-container').not('.slick-initialized').slick({
                centerMode: true,
                centerPadding: '60px',
                slidesToShow: 1,
                arrows: false,
                autoplay: true,
                responsive: [
                {
                    breakpoint: 768,
                    settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 3
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                    }
                }
                ]
            });
        });  
    });  
}

var handelize = (function() {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç'{}´-+¿?.,;:[]*¨¡!=()&%$#/\"_",
        //to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc                         ",
        to = " ",
        mapping = {};
    for(var i = 0, j = from.length; i < j; i++ )
        //mapping[ from.charAt( i ) ] = to.charAt( i );
        mapping[ from.charAt( i ) ] = to;
    return function( str ) {
        var ret = [];
        for( var i = 0, j = str.length; i < j; i++ ) {
            var c = str.charAt( i );
            if( mapping.hasOwnProperty( str.charAt( i ) ) )
                ret.push( mapping[ c ] );
            else
                ret.push( c );
        }
        //return ret.join( '' );
        return ret.join( '' ).trim().replace( /[^-A-Za-z0-9]+/g, '-' ).toLowerCase();
    };
})();
var handelizeSpaces = (function() {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç'{}´-+¿?.,;:[]*¨¡!=()&%$#/\"_",
        //to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc                         ",
        to = " ",
        mapping = {};
    for(var i = 0, j = from.length; i < j; i++ )
        //mapping[ from.charAt( i ) ] = to.charAt( i );
        mapping[ from.charAt( i ) ] = to;
    return function( str ) {
        var ret = [];
        for( var i = 0, j = str.length; i < j; i++ ) {
            var c = str.charAt( i );
            if( mapping.hasOwnProperty( str.charAt( i ) ) )
                ret.push( mapping[ c ] );
            else
                ret.push( c );
        }
        //return ret.join( '' );
        return ret.join( '' ).trim().replace( /[^-A-Za-z0-9]+/g, '' ).toLowerCase();
    };
})();

function getMinMax(products) {
    var minmax = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];      
    var tmp;
    products.forEach(function(product, j){
    for (var i=product.variants.length-1; i>=0; i--) {
        tmp = product.variants[i].price;
        if (tmp < minmax[0]) minmax[0] = tmp;
        if (tmp > minmax[1]) minmax[1] = tmp;
    }
    });
    return minmax;
}

/* Sorting Block */
function sorting(products){
    function sortByPriceABC(products){
        var prod = products.sort(function(a, b){
            if (a.variants[0].price > b.variants[0].price) {
            return 1;
            }
            if (a.variants[0].price < b.variants[0].price) {
            return -1;
            }
            return 0;
        });
        renderProducts(prod, '#product-container');
    }
    function sortByPriceCBA(products){
        var prod = products.sort(function(a, b){
            if (a.variants[0].price > b.variants[0].price) {
            return -1;
            }
            if (a.variants[0].price < b.variants[0].price) {
            return 1;
            }
            return 0;
        });
        renderProducts(prod, '#product-container');
    }
    function sortByPriceFeat(products){
        var prod = products.sort(function(a, b){
            if (a.tags.includes('featured')) {
            return -1;
            } else{
            return 1;                
            }
            return 0;
        });
        renderProducts(prod, '#product-container');
    }
    function sortBySells(){
        $.get('/products.json?collection_id=10120429592&sorted=true', function(res){
            prod = res.products;
            renderProducts(prod, '#product-container');
        });
    }
    if (!$('header#sort-container .grid').length){        
        var nowShowing = '<div class="grid__item medium-up--one-quarter"><div id="product-count">Now Showing <span>' + products.length + '</span></div></div>';
        var sort = '<div id="sorting-buttons" class="medium--np grid__item medium-up--two-quarters">SORT BY <p id="sort-by-feat">FEATURED</p><p id="sort-by-sells">BEST SELLERS</p></div>';
        var sortByPrice = '<div id="price-sort" class="grid__item medium-up--one-quarter text-right"><p id="sort-by-abc">$ - $$$</p> <p id="sort-by-cba">$$$ - $</p></div>';
        var container = '<div class="grid">'+ nowShowing + sort + sortByPrice + '</div>';
        jQuery('header#sort-container').prepend(container).fadeIn();
        jQuery('#sort-by-abc').click(function(){
            $(this).addClass('active');
            jQuery('#sort-by-cba').removeClass('active');
            jQuery('#sort-by-feat').removeClass('active');
            jQuery('#sort-by-sells').removeClass('active');
            sortByPriceABC(products);
        });
        jQuery('#sort-by-cba').click(function(){
            jQuery('#sort-by-abc').removeClass('active');
            jQuery('#sort-by-feat').removeClass('active');
            jQuery('#sort-by-sells').removeClass('active');            
            $(this).addClass('active');
            sortByPriceCBA(products);
        });

        jQuery('#sort-by-feat').click(function(){
            jQuery('#sort-by-cba').removeClass('active');
            jQuery('#sort-by-sells').removeClass('active');
            jQuery('#sort-by-abc').removeClass('active');            
            $(this).addClass('active');
            sortByPriceFeat(products);
        });

        jQuery('#sort-by-sells').click(function(){
            jQuery('#sort-by-cba').removeClass('active');
            jQuery('#sort-by-feat').removeClass('active');
            jQuery('#sort-by-abc').removeClass('active');            
            $(this).addClass('active');
            sortBySells();
        });
    }

    if ($('#product-count span').text() != products.length){
        $('#product-count span').fadeOut(function(){
            $('#product-count span').empty(); 
            $('#product-count span').text(products.length);
            $('#product-count span').fadeIn(); 
        });   
    }
}
/* End of Sorting Block */
/* Filters */
function filter(products, collections, appender){
        
        var minmax = getMinMax(products);
        function priceFilter(products, event, ui){
            var arr = [];
            products.forEach(function(product, i, products){
                for (var i=0; i < product.variants.length; i++){
                    if (product.variants[i].price >= ui.values[ 0 ] && product.variants[i].price <= ui.values[ 1 ]){
                        if(!arr.includes(product)){
                            arr.push(product);
                        }
                    }
                }
            });
            return arr;      
        }

        function uniq_fast(a) {
            var seen = {};
            var values = {};
            var out = [];
            var len = a.length;
            var j = 0;
            for(var i = 0; i < len; i++) {
                var item = a[i];
                if(seen[item.name] !== 1) {
                        seen[item.name] = 1;
                        out[j] = a[i];
                        values[item.name] = item.values;
                        j++;
                } else {
                    values[item.name] = values[item.name].concat(item.values);
                }
            }
            for(var val in values) {
                for(var i = 0; i < out.length; i++){
                if(val == out[i].name){
                    out[i].values = values[val];
                }
                }
            }
            return out;
            }
            renderOptions(products, collections);            
            bindOptions(products);
                $(function(){
                    $( "#slider-range" ).slider({
                        range: true,
                        min: Math.round(minmax[0]),
                        max: Math.round(minmax[1]),
                        values: [ Math.round(minmax[0]), Math.round(minmax[1]) ],
                        slide: function( event, ui ) {
                          $( "#min-price" ).text( "$" + ui.values[ 0 ]);
                          $( "#max-price" ).text( "$" + ui.values[ 1 ] );
                        },
                        change: function( event, ui ) {
                            var newProducts = priceFilter(products, event, ui);
                            renderProducts(newProducts, '#product-container');
                        }
                      });
                });

function renderPrice(products){
    var minmax = getMinMax(products);    
    $( "#slider-range" ).slider({
        range: true,
        min: Math.round(minmax[0]),
        max: Math.round(minmax[1]),
        values: [ Math.round(minmax[0]), Math.round(minmax[1]) ],
        slide: function( event, ui ) {
          $( "#min-price" ).text( "$" + ui.values[ 0 ]);
          $( "#max-price" ).text( "$" + ui.values[ 1 ] );
        },
        change: function( event, ui ) {
            var newProducts = priceFilter(products, event, ui);
            renderProducts(newProducts, '#product-container');            
        }
      });

      $( "#min-price" ).text( "$" + $( "#slider-range" ).slider( "values", 0 ));
      $( "#max-price" ).text( "$" + $( "#slider-range" ).slider( "values", 1 ));
}
function renderOptions(newProducts, collections){

            let options = [];
            newProducts.forEach(function(product, i){
                if ( product.options[0].values[0] != 'Default Title' ) {
                    product.options.forEach(function(PrOption, i, PrOptions){
                        options.push(PrOption);          
                    });
                }
            });
            options = uniq_fast(options);
            let slider_range = '<div id="slider-range"></div>';
            let button = '<button class="accordion">Price</button>';
            let accordion = '<div class="panel"><div id="price-filter" style="padding: 25px 10px 70px;" class="contain">' + slider_range + '<span id="min-price" ></span> <span id="max-price" ></span></div></div>';
            let block = button + accordion;
            let priceContainer = '<div id="price-filter-container">' + block + '</div>';            
            jQuery('#price-filter-container').remove();
            jQuery(appender).append(priceContainer);
            renderPrice(newProducts);
            
            options.forEach(function(item, i ,options){
            
                button = '<button class="accordion">'+ item.name +'</button>';
                accordion = '<div class="panel"><div id="'+ handelize(item.name) +'-filter" style="padding: 0px 0px 45px;" class="contain"></div></div>';
                block = button + accordion;
            
                jQuery(appender).append(block);
                let accordionContainer = jQuery('#'+handelize(item.name)+'-filter'); 
                item.values.forEach(function(value, i){
                    if (item.name == 'Color'){
                        var label = '<label class="filter-color-label" style="background-color: ' + handelizeSpaces(value) + '" for="'+ handelize(value) + '_' + i + '"><span class="filter-color-label-span">' + value + '</span></label>';        
                        var input = '<input style="display: none;" class="filter" id="' + handelize(value) + '_' + i + '" type="checkbox" value="' + value + '" />';            
                    } else {
                        var label = '<label class="filter-label" for="'+ handelize(value) + '_' + i + '"><span class="filter-label-span">' + value + '</span></label>';        
                        var input = '<input style="display: none;" class="filter" id="' + handelize(value) + '_' + i + '" type="checkbox" value="' + value + '" />';            
                    }
                    var filterCheck = '<div class="filter-tag filter-check">' + input + label + '</div>';
                    jQuery(accordionContainer).append(filterCheck);
                });
            });
                button = '<button class="accordion">Collections</button>';
                accordion = '<div class="panel" id="collections-filter"><a class="filter-collection-link" data-collection="All" href="#">All</a></div>';
                block = button + accordion;
                jQuery(appender).append(block);
                let types = [];
                newProducts.forEach(function(product, i){
                    if(!types.includes(product.product_type)){
                        types.push(product.product_type);    
                    }      
                });

                function filterByCollection(product_type_filter){

                    let filteredProducts = [];
                    newProducts.forEach(function(product, i){
                        if(product.product_type == product_type_filter ){
                            filteredProducts.push(product);    
                        }      
                    });
                    if (filteredProducts.length == 0) {
                        filteredProducts = newProducts;
                    }
                    renderProducts(filteredProducts, '#product-container');
                }
                types.forEach(function(type, i){
                        let collectionLink = '<a class="filter-collection-link" data-collection="'+type+'" href="#">'+type+'</a>';
                        jQuery('#collections-filter').append(collectionLink);
                });
                initAccordeon();
                $('a[data-collection]').click(function() {
                    filterByCollection($(this).data('collection'));
                });
}

function filterByValues(products){
    var arr = [];
    let options = [];

    $('.active-filter:checked').each(function(index){
        options.push($(this).val());
    });
        console.log(options);
        console.log(products);
        if (options.length > 0){
            products.forEach(function(product){
                product.options.forEach(function(option){
                        options.forEach(function(currentOpt){
                            if (option.values.includes(currentOpt) && !arr.includes(product)){
                                arr.push(product);
                            }
                        });
                });
            });
        } else {
            arr = products;
        }
    return arr;
}

function bindOptions(products, collections){
    var filters = document.getElementsByClassName("filter");
    for (var c = 0; c < filters.length; c++) {
        filters[c].onchange = function() {
                $(this).toggleClass('active-filter');
                $(this).toggleClass('active');
                var newProducts = filterByValues(products);
                renderPrice(newProducts);                
                renderProducts(newProducts, '#product-container');
        }
    }
}

      /* End of Check box filters */
  
    /* End of Bind filter actions */
  
    /* Accordion filters */
function initAccordeon(){
    var acc = document.getElementsByClassName("accordion");
    var i;
    
    for (i = 0; i < acc.length; i++) {
      acc[i].onclick = function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight){
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + 15 + "px";
        } 
      }
    }
}
    /* End of Accordion filters */
    
}
  
/* End Of Filters */