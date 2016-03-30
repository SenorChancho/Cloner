(function($) {
    "use strict"; // use strict to start

    var glimmerApp = {
        /* ---------------------------------------------
         Preloader
         --------------------------------------------- */
        preloader: function() {
            $(window).on('load', function() {
                $("body").imagesLoaded(function() {
                    $('.preloader').delay(500).slideUp('slow', function() {
                        $(this).remove();
                    });
                });
            });
        },
        /* ---------------------------------------------
         Value To Placeholder
         --------------------------------------------- */
        placeholder: function() {
            var $ph = $('input[type="search"], input[type="text"], input[type="email"], textarea');
            $ph.each(function() {
                var value = $(this).val();
                $(this).focus(function() {
                    if ($(this).val() === value) {
                        $(this).val('');
                    }
                });
                $(this).blur(function() {
                    if ($(this).val() === '') {
                        $(this).val(value);
                    }
                });
            });
        },
        /* ---------------------------------------------
         Menu
         --------------------------------------------- */
        menu: function() {
            var combinedmenu = $('#nav-left ul.menu-list').clone(),
                secondmenu = $('#nav-right ul.menu-list').clone();

            secondmenu.children('li').appendTo(combinedmenu);
            combinedmenu.appendTo('#mobile-menu-wrap');

            var items = $('.overlapblackbg, .slideLeft'),
                menucontent = $('.menucontent'),
                submenu = $('.menu-list li').has('.menu-submenu'),
                menuopen = function() {
                    $(items).removeClass('menuclose').addClass('menuopen');
                },
                menuclose = function() {
                    $(items).removeClass('menuopen').addClass('menuclose');
                };
            $('#navToggle').on('click', function() {
                if (menucontent.hasClass('menuopen')) {
                    $(menuclose);
                } else {
                    $(menuopen);
                }
            });
            menucontent.on('click', function() {
                if (menucontent.hasClass('menuopen')) {
                    $(menuclose);
                }
            });
            $('#navToggle,.overlapblackbg').on('click', function() {
                $('.menucontainer').toggleClass("mrginleft");
            });
            if (submenu) {
                $('.menu-submenu').prev().append('<span class="fa fa-angle-down"></span>');
            }
            submenu.prepend('<span class="menu-click"><i class="menu-arrow fa fa-plus"></i></span>');
            $('.menu-mobile').on('click', function() {
                $('.menu-list').slideToggle('slow');
            });
            $('.menu-click').on('click', function() {
                $(this).siblings('.menu-submenu').slideToggle('slow');
                $(this).children('.menu-arrow').toggleClass('menu-extend');
            });
        },
        /* ---------------------------------------------
         Mobile Social Area
         --------------------------------------------- */
        socialarea_mobile: function() {
            var social = $('#header-top .header-social').clone();
            social.appendTo('#mobile-menu-wrap');
            $('#mobile-menu-wrap .header-social').prepend('<span>Follow us on-</span>');
        },

        /* ---------------------------------------------
         smooth scroll
         --------------------------------------------- */
        smoothscroll: function() {
            if (typeof smoothScroll == 'object') {
                smoothScroll.init();
            }
        },
        /* ---------------------------------------------
         For Video Fit Function
         --------------------------------------------- */
        video: function() {
            $(".feature-area").fitVids();
            $(".content-area").fitVids();
        },
        /* ---------------------------------------------
         Background Fit Image
         --------------------------------------------- */
        background_fit_image: function() {
            $.fn.bgImage = function() {
                $(this).each(function() {
                    var $image = $(this).find('img');
                    var imageSource = $image.attr('src');
                    $image.css('visibility','hidden');
                    $(this).css('backgroundImage', 'url(' + imageSource + ')');
                    if(!$image.length) {
                        $(this).css('backgroundImage', 'none');
                    }                    
                });
            };  
            $('#featured-slider .post-thumb').bgImage();
            $('.related-post-item .post-media').bgImage();
        },
        /* ---------------------------------------------
         Featured Carousel
         --------------------------------------------- */
        featured_area: function() {
            var item = 3;
            $('#featured-slider').owlCarousel({
                center: false,
                items: item,
                autoplay: false,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                singleItem: false,
                loop: true,
                margin: 30,
                nav: true,
                dots: true,
                navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
                responsive: {
                    280: {
                        items: 1
                    },
                    500: {
                        items: 1
                    },
                    600: {
                        items: 1
                    },
                    700: {
                        items: 2
                    },
                    768: {
                        items: 2
                    },
                    800: {
                        items: 2
                    },
                    1000: {
                        items: item
                    },
                    1200: {
                        items: item
                    },
                    1400: {
                        items: item
                    }
                }
            });
            var itemCount = $('#featured-slider .owl-item').length,
                itemCloneCount = $('#featured-slider .owl-item.cloned').length;
            if (itemCount <= item && itemCloneCount <= item * 2) {
                $('#featured-slider .owl-nav').hide();
            }
        },
        /* ---------------------------------------------
         Featured Post Height Fix
         --------------------------------------------- */
        post_height: function() {
            $.fn.fixedHeight = function() {
                var maxHeight = 0;
                $(this).each(function() {
                    var prevHeight = $(this).height();
                    var thisHeight = $(this).height('auto').height();
                    $(this).height(prevHeight);
                    maxHeight = (maxHeight > thisHeight ? maxHeight : thisHeight);
                    var video = $(this).find('.fluid-width-video-wrapper') || $(this).find('.mejs-container');
                    if(video) {
                        video.parent().height('auto');
                        video.css('height', '' + maxHeight + 'px');
                    }
                });
                $(this).height(maxHeight);
            };
            $(window).on('load', function() {
                $('#featured-slider .post-thumb').fixedHeight();
                $('#featured-slider .post-content').fixedHeight();
                $('.related-post-item .post-media').fixedHeight();
            });
        },
        /* ---------------------------------------------
         Home Version Grid Masonry
         --------------------------------------------- */
        grid_masonry: function() {
            if ($('#masonry-layout').length > 0) {
                var container = $('#masonry-layout');
                container.imagesLoaded(function() {
                    container.masonry({
                        itemSelector: '.grid'
                    });
                });
            }
        },
        /* ---------------------------------------------
         Chat More Button fix
         --------------------------------------------- */
        chat_more_button: function() {
            if ($('.chat-text p .more-link').length) {
                $('.chat-text p .more-link').detach().appendTo('#readmore-add');
            }
        },
        /* ---------------------------------------------
         Grid Version Read more Fix
         --------------------------------------------- */
        gridmore_button: function() {
            if ($('.grid .entry-content p .more-link').length) {
                $('.grid .entry-content p .more-link').remove();
            }
        },
        /* ---------------------------------------------
         Gallery Style One Carousel
         --------------------------------------------- */
        gallary_one: function() {
            $('.gallery-one').owlCarousel({
                items: 1,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                singleItem: true,
                loop: true,
                nav: true,
                navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
                owl2row: 'true',
                owl2rowTarget: 'item',
                responsive: {
                    1170: {
                        items: 1
                    }
                }
            });
            $('.gallery-one .item').on('click', function(e) {
                e.preventDefault();
                $('.gallery-one').magnificPopup({
                    delegate: 'a',
                    type: 'image',
                    closeOnContentClick: false,
                    closeBtnInside: false,
                    mainClass: 'mfp-with-zoom mfp-img-mobile',
                    image: {
                        verticalFit: true,
                    },
                    gallery: {
                        enabled: true
                    },
                    zoom: {
                        enabled: true,
                        duration: 300,
                        opener: function(element) {
                            return element.find('img');
                        }
                    },
                });
            });
        },
        /* ---------------------------------------------
         Gallery Style Two Carousel
         --------------------------------------------- */
        gallary_two: function() {
            var $sync1 = $(".full-view"),
                $sync2 = $(".list-view"),
                duration = 300;

            $sync1
                .owlCarousel({
                    items: 1,
                    margin: 10,
                    nav: true,
                    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
                    owl2row: 'true',
                    owl2rowTarget: 'item'
                })
                .on('changed.owl.carousel', function(e) {
                    var syncedPosition = syncPosition(e.item.index);
                    if (syncedPosition != "stayStill") {
                        $sync2.trigger('to.owl.carousel', [syncedPosition, duration, true]);
                    }
                });
            $('.full-view .item').on('click', function(e) {
                e.preventDefault();
                $sync1.magnificPopup({
                    delegate: 'a',
                    type: 'image',
                    closeOnContentClick: false,
                    closeBtnInside: false,
                    mainClass: 'mfp-with-zoom mfp-img-mobile',
                    image: {
                        verticalFit: true,
                    },
                    gallery: {
                        enabled: true
                    },
                    zoom: {
                        enabled: true,
                        duration: 300,
                        opener: function(element) {
                            return element.find('img');
                        }
                    },
                });
            });
            $sync2
                .owlCarousel({
                    margin: 5,
                    items: 6,
                    nav: false,
                    center: false,
                    dots: false,
                    responsive: {
                        280: {
                            items: 2
                        },
                        500: {
                            items: 2
                        },
                        600: {
                            items: 3
                        },
                        800: {
                            items: 4
                        },
                        1000: {
                            items: 5
                        },
                        1200: {
                            items: 5
                        },
                        1400: {
                            items: 5
                        },
                    }
                })
                .on('initialized.owl.carousel', function() {
                    addClassCurrent(0);
                })
                .on('click', '.owl-item', function() {
                    $sync1.trigger('to.owl.carousel', [$(this).index(), duration, true]);

                });

            function addClassCurrent(index) {
                $sync2
                    .find(".owl-item.active")
                    .removeClass("current")
                    .eq(index)
                    .addClass("current");
            }
            addClassCurrent(0);

            function syncPosition(index) {
                addClassCurrent(index);
                var itemsNo = $sync2.find(".owl-item").length;
                var visibleItemsNo = $sync2.find(".owl-item.active").length;

                if (itemsNo === visibleItemsNo) {
                    return "stayStill";
                }
                var visibleCurrentIndex = $sync2.find(".owl-item.active").index($sync2.find(".owl-item.current"));
                if (visibleCurrentIndex == 0 && index != 0) {
                    return index - 1;
                }
                if (visibleCurrentIndex == (visibleItemsNo - 1) && index != (itemsNo - 1)) {
                    return index - visibleItemsNo + 2;
                }
                return "stayStill";
            }
        },
        /* ---------------------------------------------
         Justified Gallery
         --------------------------------------------- */
        gallery_justified: function() {
            if ($('.glimmer-tiled-gallery').length) {
                var tiledItemSpacing = 4;
                $('.glimmer-tiled-gallery').wrap('<div class="glimmer-tiled-gallery-row"></div>');
                $('.glimmer-tiled-gallery').parent().css('margin', -tiledItemSpacing);
                $('.glimmer-tiled-gallery').justifiedGallery({
                    rowHeight: 150,
                    lastRow: 'justify',
                    maxRowHeight: '200%',
                    margins: tiledItemSpacing,
                    waitThumbnailsLoad: false
                });
            }
            $('.glimmer-tiled-gallery').magnificPopup({
                delegate: 'a',
                type: 'image',
                closeOnContentClick: false,
                closeBtnInside: false,
                mainClass: 'pp-gallery mfp-with-zoom mfp-img-mobile',
                image: {
                    verticalFit: true,
                },
                gallery: {
                    enabled: true
                },
                zoom: {
                    enabled: true,
                    duration: 300,
                    opener: function(element) {
                        return element.find('img');
                    }
                },
            });
        },
        /* ---------------------------------------------
         WP Comment Form Fix
         --------------------------------------------- */
        comment_form: function() {
            // $( "#contact_form > p" ).wrap( "<div class='col-md-12'></div>" );
            // $( "#contact_form > div" ).wrapAll( "<div class='row'></div>" );
        },
        /* ---------------------------------------------
         Instagram Image
         --------------------------------------------- */
        instafeed: function() {
            var userFeed = new Instafeed({
                limit: 6,
                clientId: '97ae5f4c024c4a91804f959f43f2635f',
                target: 'instafeed',
                get: 'tagged',
                tagName: 'photographyportfolio',
                //get: 'user',
                //userId: Your user Id,
                //accessToken: '', //Your Access Token
                resolution: 'standard_resolution',
                template: '<div class="list"><a target="_blank" href="{{link}}"><img src="{{image}}" /></a></div>'
            });
            userFeed.run();
        },
        /* ---------------------------------------------
         Flickr Feed
         --------------------------------------------- */
        flickr_widget: function() {
            $('#flickr').jflickrfeed({
                    limit: 9, //Image Limit
                    qstrings: {
                        id: "52617155@N08" //Flickr id
                    },
                    itemTemplate: '<li><a href="{{link}}"><img src="{{image_t}}" alt="{{title}}" /></a></li>'
                },
                function(data) {
                    $('#flickr li').hover(function() {
                            $(this).children('div').show();
                        },

                        function() {
                            $(this).children('div').hide();
                        });
                });
        },
        /* ---------------------------------------------
         Twitter Widget
         --------------------------------------------- */
        twitter_feed: function() {
            var tp_url = "https://twitter.com/username"; //Twitter User name Url
            var tp_count = 2; //Number of post your are show
            var twitter_widget_id = "twitter_widget_id"; //Twitter Widget id

            var twitter_section = '<a class="twitter-timeline" href="' + tp_url + '" data-widget-id="' + twitter_widget_id + '" data-link-color="#0062CC" data-chrome="nofooter noscrollbar noborders transparent" data-tweet-limit="' + tp_count + '">Tweets</a>';
            twitter_section += "<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\"://platform.twitter.com/widgets.js\";fjs.parentNode.insertBefore(js,fjs);}}(document,\"script\",\"twitter-wjs\");</script>";

            $('#twitter_profile_embed').append(twitter_section); 
        },
        /* ---------------------------------------------
         Mail Chip
         --------------------------------------------- */
        mailchip: function() {
            if ($("#newsletter-form").length) {
                $("#newsletter-form").formchimp();
            }
        },
        /* ---------------------------------------------
         Maps
         --------------------------------------------- */
        maps: function() {
            if ($('#gmaps').length) {
                var map;

                map = new GMaps({
                    el: '#gmaps',
                    lat: 43.04446,
                    lng: -76.130791,
                    scrollwheel: false,
                    zoom: 10,
                    zoomControl: true,
                    panControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    overviewMapControl: false,
                    clickable: false
                });

                var image = 'images/map-icon.png';
                map.addMarker({
                    lat: 43.04446,
                    lng: -76.130791,
                    icon: image,
                    animation: google.maps.Animation.DROP,
                    verticalAlign: 'bottom',
                    horizontalAlign: 'center'
                });

                var styles = [{
                    "featureType": "road",
                    "stylers": [{
                        "color": "#b4b4b4"
                    }]
                }, {
                    "featureType": "water",
                    "stylers": [{
                        "color": "#d8d8d8"
                    }]
                }, {
                    "featureType": "landscape",
                    "stylers": [{
                        "color": "#f1f1f1"
                    }]
                }, {
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#000000"
                    }]
                }, {
                    "featureType": "poi",
                    "stylers": [{
                        "color": "#d9d9d9"
                    }]
                }, {
                    "elementType": "labels.text",
                    "stylers": [{
                        "saturation": 1
                    }, {
                        "weight": 0.1
                    }, {
                        "color": "#000000"
                    }]
                }]
            }
        },
        /* ---------------------------------------------
         Contact Form
         --------------------------------------------- */
        contact_form: function() {
            if ($('#contact-form-wrap').length) {
                var form = $('#contact_form'); 
                form.submit(function(event) {
                    event.preventDefault();
                    var data = form.serialize();
                    var form_status = $('<div class="form_status"></div>');
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        data: data,
                        url: $(this).attr('action'),
                        beforeSend: function() {
                            form.before(form_status.html('<p><i class="fa fa-spinner fa-spin"></i> Email is sending...</p>').fadeIn());
                        }
                    }).done(function(data) {
                        form_status.html('<p class="text-success">' + data.message + '</p>').delay(3000).fadeOut();
                    });         
                }); 
            }
        },
        /* ---------------------------------------------
         If WP Admin bar Come
         --------------------------------------------- */
        wp_adminbar: function() {
            // This function gets called with the user has scrolled the window.
            $(window).on('scroll', function() {
                if ($(this).scrollTop() > 0) {
                    // Add the scrolled class to those elements that you want changed
                    $(".overlay-slidedown.open").addClass("scroll");
                } else {
                    $(".overlay-slidedown.open").removeClass("scroll");
                }
            });
        },
        /* ---------------------------------------------
         Scroll top
         --------------------------------------------- */
        scroll_top: function() {
            $("body").append("<a href='#top' id='scroll-top' class='topbutton btn-hide'><span class='glyphicon glyphicon-menu-up'></span></a>");
            var $scrolltop = $('#scroll-top');
            $(window).on('scroll', function() {
                if ($(this).scrollTop() > $(this).height()) {
                    $scrolltop
                        .addClass('btn-show')
                        .removeClass('btn-hide');
                } else {
                    $scrolltop
                        .addClass('btn-hide')
                        .removeClass('btn-show');
                }
            });
            $("a[href='#top']").on('click', function() {
                $("html, body").animate({
                    scrollTop: 0
                }, "normal");
                return false;
            });
        },
        /* ---------------------------------------------
         Initialize All Function
         --------------------------------------------- */
        initializ: function() {
            glimmerApp.preloader();
            glimmerApp.placeholder();
            glimmerApp.menu();
            glimmerApp.socialarea_mobile();
            glimmerApp.smoothscroll();
            glimmerApp.video();
            glimmerApp.background_fit_image();
            glimmerApp.featured_area();
            glimmerApp.post_height();
            glimmerApp.grid_masonry();
            glimmerApp.chat_more_button();
            glimmerApp.gridmore_button();
            glimmerApp.gallary_one();
            glimmerApp.gallary_two();
            glimmerApp.gallery_justified();
            glimmerApp.instafeed();
            glimmerApp.flickr_widget();
            glimmerApp.twitter_feed();
            glimmerApp.mailchip();
            glimmerApp.maps();
            glimmerApp.comment_form();
            glimmerApp.wp_adminbar();
            glimmerApp.scroll_top();
        }
    };
    /* ---------------------------------------------
     Document ready function
     --------------------------------------------- */
    $(function() {
        glimmerApp.initializ();
    });
    /* ---------------------------------------------
     Without Document ready function
     --------------------------------------------- */
    glimmerApp.contact_form();

})(jQuery);