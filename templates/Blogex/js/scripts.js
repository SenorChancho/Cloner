(function($) {
    "use strict";

    $(document).ready(function() {


        // Menu
        $('.menu').slicknav({
            prependTo: '.mobile-menu',
            label: '',
            closedSymbol: '&#xf054;',
            openedSymbol: '&#xf078;'
        });

        // owl Carousel

        $(".owl-demo").owlCarousel({
            navigation: false,
            //        autoPlay: 3000, //Set AutoPlay to 3 seconds
            items: 3,
            itemsDesktop: [1199, 3],
            itemsDesktopSmall: [980, 2],
            itemsTablet: [768, 2],
            itemsTabletSmall: [568, 1],
            itemsMobile: [479, 1]
        });

        $(".post-carousel").owlCarousel({
            navigation: false,
            //        autoPlay: 3000, //Set AutoPlay to 3 seconds
            items: 3,
            itemsDesktop: [1199, 3],
            itemsDesktopSmall: [980, 2],
            itemsTablet: [768, 2],
            itemsTabletSmall: [568, 1],
            itemsMobile: [479, 1]
        });

        // Bxslider

        $('.bxslider').bxSlider({
            adaptiveHeight: false,
            mode: 'fade',
            pager: true,
            captions: true
        });

        /*==Animated Share==*/

        $('.share-row').on('click', function(ev) {
            new WOW().init();
            $(this).parents('.post-item').children('.share-info').fadeIn(200);
            $(this).parents('.post-item').siblings('.post-item').children('.share-info').fadeOut(200);

            ev.preventDefault();

        });
        $('.share-close').on('click', function(ev) {
            $(this).parents('.post-item').children('.share-info').fadeOut(200);
            ev.preventDefault();
        });

        /*==Social Share==*/
        $('.facebook').each(function() {
            var title = $(this).attr('data-url');
            var fb = 'http://www.facebook.com/sharer.php?u=' + title;
            $(this).attr("href", fb)
        });
        $('.twitter').each(function() {
            var title = $(this).attr('data-url');
            var tweet = 'https://twitter.com/home?status=' + title;
            $(this).attr("href", tweet)
        });
        $('.google-plus').each(function() {
            var title = $(this).attr('data-url');
            var gplus = 'https://plus.google.com/share?url=' + title;
            $(this).attr("href", gplus)
        });
        $('.pinterest').each(function() {
            var title = $(this).attr('data-url');
            var dataImg = $(this).attr('data-src');
            var pin = 'https://pinterest.com/pin/create/button/?url=' + title + '&media=' + dataImg
            $(this).attr("href", pin)
        });
        $('.linked-in').each(function() {
            var title = $(this).attr('data-url');
            var link = 'https://www.linkedin.com/shareArticle?mini=true&url=' + title
            $(this).attr("href", link)
        });
        /*===iso tope blog start===*/
        var $container = $('.masonry-list'),
            colWidth = function() {
                var w = $container.width(),
                    columnNum = 1,
                    columnWidth = 0;
                if (w > 1200) {
                    columnNum = 2;
                } else if (w > 900) {
                    columnNum = 2;
                } else if (w > 600) {
                    columnNum = 2;
                } else if (w > 300) {
                    columnNum = 1;
                }
                columnWidth = Math.floor(w / columnNum);
                $container.find('.post-item').each(function() {
                    var $item = $(this),
                        multiplier_w = $item.attr('class').match(/item-w(\d)/),
                        multiplier_h = $item.attr('class').match(/item-h(\d)/),
                        width = multiplier_w ? columnWidth * multiplier_w[1] - 20 : columnWidth - 20;
                    //                                height = multiplier_h ? columnWidth*multiplier_h[1]*0.5-4 : columnWidth*0.5-4;
                    $item.css({
                        width: width
                        //                            height: height
                    });
                });
                return columnWidth;
            },
            isotope = function() {
                $container.isotope({
                    resizable: false,
                    itemSelector: '.post-item',
                    masonry: {
                        columnWidth: colWidth()
                        //                            gutterWidth: 10
                    }
                });
            };
        isotope();
        $(window).smartresize(isotope);
        $(window).load(isotope);
        /*===iso tope blog end===*/

        /*===iso tope blog start 3 column===*/
        function threeColMasonry(){
            var $container = $('.masonry-list-three'),
                colWidth = function() {
                    var w = $container.width(),
                        columnNum = 1,
                        columnWidth = 0;
                    if (w > 1200) {
                        columnNum = 3;
                    } else if (w > 900) {
                        columnNum = 3;
                    } else if (w > 600) {
                        columnNum = 2;
                    } else if (w > 300) {
                        columnNum = 1;
                    }
                    columnWidth = Math.floor(w / columnNum);
                    $container.find('.post-item').each(function() {
                        var $item = $(this),
                            multiplier_w = $item.attr('class').match(/item-w(\d)/),
                            multiplier_h = $item.attr('class').match(/item-h(\d)/),
                            width = multiplier_w ? columnWidth * multiplier_w[1] - 20 : columnWidth - 20;
                        //                                height = multiplier_h ? columnWidth*multiplier_h[1]*0.5-4 : columnWidth*0.5-4;
                        $item.css({
                            width: width
                            //                            height: height
                        });
                    });
                    return columnWidth;
                },
                isotope = function() {
                    $container.isotope({
                        resizable: false,
                        itemSelector: '.post-item',
                        masonry: {
                            columnWidth: colWidth()
                            //                            gutterWidth: 10
                        }
                    });
                };
            isotope();
            $(window).smartresize(isotope);
            $(window).load(isotope);
        }
        threeColMasonry();
        /*===iso tope blog end===*/



        //Justified Grid
        $(".grid-gallery").justifiedGallery({
            rowHeight: 300,
            fixedHeight: false,
            lastRow: 'justify',
            margins: 10,
            randomize: false
        });

        // lightgallery
        $(".lightGallery").lightGallery();
        $('.grid-gallery').lightGallery();


        // scroll up

        $.scrollUp({
            scrollName: 'scrollUp', // Element ID
            topDistance: '300', // Distance from top before showing element (px)
            topSpeed: 300, // Speed back to top (ms)
            animation: 'fade', // Fade, slide, none
            animationInSpeed: 200, // Animation in speed (ms)
            animationOutSpeed: 200, // Animation out speed (ms)
            scrollText: '<i class="fa fa-angle-double-up"></i>', // Text for element
            activeOverlay: false // Set CSS color to display scrollUp active point, e.g '#00FFFF'
        });


        // tiles view

        function titleView() {

            $('.grid-2 > .dbl-row:odd').addClass('row-odd');
            $('.grid-2 > .dbl-row:even').addClass('row-even');

            $('.grid-2').each(function() {
                var bgcImg = $(this).data('src');

                if (bgcImg) {
                    $(this).css({
                        'background-image': "url(" + bgcImg + ")",
                        'background-repeat': 'no-repeat'
                    })
                }
            });
            $('.grid-3').each(function() {
                var bgcImg = $(this).data('src');

                if (bgcImg) {
                    $(this).css({
                        'background-image': "url(" + bgcImg + ")",
                        'background-repeat': 'no-repeat',
                        'background-size': 'cover'
                    })
                }
            });

            $('.tiles-view').each(function() {
                var gridC = $(this).find('.grid-2');
                var gridRc = $(this).find('.grid-2 .dbl-row');
                var gridRr = $(this).find('.grid-2 .dbl-row .grid-3');
                var gridRcL = gridRc.length;

                var gridL = gridC.length;
                console.log(gridRcL);

                if (gridL === 1) {


                    gridC.removeClass('grid-2');
                    gridC.addClass('grid-1');
                    $('.grid-1').each(function() {
                        var bgcImg = $(this).data('src');

                        if (bgcImg) {
                            $(this).css({
                                'background-image': "url(" + bgcImg + ")",
                                'background-repeat': 'no-repeat'
                            })
                        }
                    });
                }

                if (gridRcL === 1) {


                    gridRr.addClass('grid-full-half')
                }

            });

        }
        titleView();


    });
})(jQuery);