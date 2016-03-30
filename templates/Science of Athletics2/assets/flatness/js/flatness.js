/*!-----------------------------------------------------------------
  Name: Flatness - Personal Blog Template
  Version: 1.0.0
  Author: nK
  Website: http://nkdev.info
  Support: http://nk.ticksy.com
  Purchase: http://themeforest.net/item/flatness-personal-html-blog-template/13435224?ref=_nK
  License: You must have a valid license purchased only from themeforest(the above link) in order to legally use the theme for your project.
  Copyright 2015.
-------------------------------------------------------------------*/
!function($) {
    'use strict'
    /*------------------------------------------------------------------

      Flatness Instance

    -------------------------------------------------------------------*/
    var FLATNESS = function(options) {
        var _this = this

        _this.options = options

        _this.$window = $(window)
        _this.$document = $(document)

        // check if mobile
        _this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/g.test(navigator.userAgent || navigator.vendor || window.opera)

        // preloader
        _this.$preloader = $('.page-preloader')

        // to top button
        _this.$scrollTopBtn = $('.scroll-top')

        // navbar
        _this.$navbar = $('.navbar-flatness')
        _this.$navbarItems = _this.$navbar.find('.nav > li > a')
        _this.$navbarHeader = _this.$navbar.find('.navbar-header')
        _this.$navbarToggleBtn = _this.$navbar.find('[data-toggle=off-canvas]')
        _this.$navbarToggleTarget = _this.$navbar.find( _this.$navbarToggleBtn.attr('data-target') )

        // sticky sidebar
        _this.$sidebar = $('.flatness-sticky-sidebar')

        // same height image
        _this.$sameHeightImg = $('.cols-same-height .post-img')

        // ajax form
        _this.$ajaxForm = $('form.flatness-ajax')

        // accordions
        _this.$accordions = $('.flatness-accordion')

        // slick carousel
        _this.$carousels = $('.flatness-carousel')
        _this.$sliders = $('.flatness-slider, .slick-slider')

        // photoswipe
        _this.$photoswipe = $('.photoswipe-gallery')

        // isotope
        _this.$masonry = $('.masonry')

        // parallax
        _this.$parallax = $('.view-parallax, .bg-parallax')

        // fullscreen item
        _this.$fullscreen = $('.flatness-fullscreen')

        // counts
        _this.$progressCount = $('.progress-count .progress-bar')
        _this.$numberCount = $('.flatness-count')
    }

    FLATNESS.DEFAULT = {
        stickySidebar:    true,  // enable sticky sidebar
        navbarMax:        200,   // max height of navbar
        navbarMin:        100     // min height of navbar
    }

    var $body = $('body')


    /*------------------------------------------------------------------

      Check for some specific classname

    -------------------------------------------------------------------*/
    var issetClass = function(classname) {
        return $body.hasClass(classname)
    }


    /*------------------------------------------------------------------

      Start Method

    -------------------------------------------------------------------*/
    FLATNESS.prototype.init = function(options) {
        var _this = this

        // init options
        _this.options = $.extend({}, this.options, options)

        // navbar go to small when load
        if(issetClass('navbar-fixed') && !issetClass('navbar-small')) {
            _this.navbarSize()
        }

        if(!_this.$preloader.length) {
            $body.addClass('flatness-loaded');
        }

        // after page load
        $(window).on('load', function() {
            // init tooltips and popovers
            $('[data-toggle="tooltip"]').tooltip({
                container: 'body'
            })
            $('[data-toggle="popover"]').popover()

            // plugins
            _this.initSlick()
            _this.initPhotoSwipe()
            _this.initMasonry()
            _this.initAccordions()

            // flatness features
            _this.navbarCollapse()
            _this.navbarSubmenuFix()
            _this.navbarScroll()
            _this.initSidebar()
            _this.initSameHeightImg()
            _this.initSmoothAnchorScroll()
            _this.initScrollTopBtn()
            _this.initAjaxForm()
            _this.initJarallax()
            _this.initFullScreenItem()
            _this.initCounters()

            if(_this.$preloader.length) {
                // some timeout after plugins init
                setTimeout(function() {
                    // hide preloader
                    _this.$preloader.fadeOut(function() {
                        $(this).find('> *').remove()
                    })
                    $body.addClass('flatness-loaded');
                }, 200)
            }
        })
    }


    // refresh method (refresh some plugins)
    FLATNESS.prototype.refresh = function() {
        this.$masonry.masonry();
    }



    /*------------------------------------------------------------------

      Init Plugins

    -------------------------------------------------------------------*/
    // Jarallax
    FLATNESS.prototype.initJarallax = function() {
        if(typeof $.fn.jarallax === 'undefined') {
            return
        }
        this.$parallax.jarallax()
    }

    // Slick
    FLATNESS.prototype.initSlick = function() {
        if( typeof $.fn.slick === 'undefined' ) {
            return
        }

        this.$carousels.each(function() {
            var size = parseInt($(this).attr('data-size') || 6)
            var autoplay = $(this).attr('data-autoplay') ? true : false;
            var autoplaySpeed = parseInt($(this).attr('data-autoplay') || 4000);
            var options = {
                infinite: true,
                autoplay: autoplay,
                autoplaySpeed: autoplaySpeed,
                dots: true,
                arrows: false,
                slidesToShow: size,
                swipeToSlide: true,
                responsive: [
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 3
                        }
                    }, {
                        breakpoint: 500,
                        settings: {
                            slidesToShow: 2
                        }
                    }
                ]
            }

            if(size == 3 || size == 4) {
                options.responsive = [{
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2
                    }
                }]
            }

            $(this).slick(options)
        })
        this.$sliders.each(function() {
            $(this).slick()
        })
    }

    // Masonry
    FLATNESS.prototype.initMasonry = function() {
        if(typeof $.fn.masonry === 'undefined') {
            return
        }

        var _this = this

        _this.$masonry.each(function() {
            var msnry = $(this)

            msnry.find('> .item').addClass('masonry-grid-item')

            // init items
            msnry.masonry({
                itemSelector: '.masonry-grid-item'
            })

            // refresh for skrollr
            // msnry.masonry('on', 'arrangeComplete', function() {
            //     _this.refresh()
            // })
            // msnry.masonry('on', 'layoutComplete', function() {
            //     _this.refresh()
            // })
        })
        _this.refresh()
    }

    // PhotoSwipe
    FLATNESS.prototype.initPhotoSwipe = function() {
        if(typeof PhotoSwipe === 'undefined' || !this.$photoswipe.length) {
            return
        }

        // prepare photoswipe markup
        var markup = [
            '<div id="gallery" class="pswp" tabindex="-1" role="dialog" aria-hidden="true">',
            '  <div class="pswp__bg"></div>',
            '  <div class="pswp__scroll-wrap">',
            '    <div class="pswp__container">',
            '      <div class="pswp__item"></div>',
            '      <div class="pswp__item"></div>',
            '      <div class="pswp__item"></div>',
            '    </div>',
            '    <div class="pswp__ui pswp__ui--hidden">',
            '      <div class="pswp__top-bar">',
            '        <div class="pswp__counter"></div>',
            '        <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>',
            '        <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>',
            '        <div class="pswp__preloader">',
            '          <div class="pswp__preloader__icn">',
            '            <div class="pswp__preloader__cut">',
            '              <div class="pswp__preloader__donut"></div>',
            '            </div>',
            '          </div>',
            '        </div>',
            '      </div>',
            '      <div class="pswp__loading-indicator"><div class="pswp__loading-indicator__line"></div></div>',
            '      <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>',
            '      <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>',
            '      <div class="pswp__caption">',
            '        <div class="pswp__caption__center">',
            '        </div>',
            '      </div>',
            '    </div>',
            '  </div>',
            '</div>'
        ].join('\n')
        $body.append(markup)

        // init code
        var parseThumbnailElements = function(el) {
            var thumbElements = el.childNodes,
                numNodes = thumbElements.length,
                items = [],
                el,
                childElements,
                thumbnailEl,
                size,
                item

            for(var i = 0; i < numNodes; i++) {
                el = thumbElements[i]

                // include only element nodes 
                if(el.nodeType !== 1) {
                    continue
                }

                el = $(el).find('> a')[0]

                childElements = el.children
                size = el.getAttribute('data-size').split('x')

                // create slide object
                item = {
                    src: el.getAttribute('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10),
                    author: el.getAttribute('data-author')
                }

                item.el = el // save link to element for getThumbBoundsFn

                if(childElements.length > 0) {
                    item.msrc = childElements[0].getAttribute('src') // thumbnail url
                    if(childElements.length > 1) {
                        item.title = childElements[1].innerHTML // caption (contents of figure)
                    }
                }

                var mediumSrc = el.getAttribute('data-med') || item.src
                if(mediumSrc) {
                    size = (el.getAttribute('data-med-size') || el.getAttribute('data-size')).split('x')
                    // "medium-sized" image
                    item.m = {
                        src: mediumSrc,
                        w: parseInt(size[0], 10),
                        h: parseInt(size[1], 10)
                    }
                }
                // original image
                item.o = {
                    src: item.src,
                    w: item.w,
                    h: item.h
                }
                items.push(item)
            }

            return items
        }

        // find nearest parent element
        var closest = function closest(el, fn) {
            return el && (fn(el) ? el : closest(el.parentNode, fn))
        }

        var onThumbnailsClick = function(e) {
            e = e || window.event
            e.preventDefault ? e.preventDefault() : e.returnValue = false

            var eTarget = e.target || e.srcElement

            var clickedListItem = closest(eTarget, function(el) {
                return el.tagName === 'A'
            })

            if(!clickedListItem) {
                return
            }

            var clickedGallery = clickedListItem.parentNode.parentNode
            var index = $(clickedListItem).parent().index()

            if(index >= 0) {
                openPhotoSwipe(index, clickedGallery)
            }
            return false
        }

        var photoswipeParseHash = function() {
            var hash = window.location.hash.substring(1),
                    params = {}

            if(hash.length < 5) { // pid=1
                return params
            }

            var vars = hash.split('&')
            for (var i = 0; i < vars.length; i++) {
                if(!vars[i]) {
                    continue
                }
                var pair = vars[i].split('=') 
                if(pair.length < 2) {
                    continue
                }           
                params[pair[0]] = pair[1]
            }

            if(params.gid) {
                params.gid = parseInt(params.gid, 10)
            }

            return params
        }

        var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = $('.pswp')[0],
                gallery,
                options,
                items

            items = parseThumbnailElements(galleryElement)

            // define options (if needed)
            options = {
                captionAndToolbarShowEmptyCaptions: false,
                mainClass: 'pswp--minimal--dark',
                barsSize: { top: 0, bottom: 0 },
                captionEl: false,
                fullscreenEl: false,
                shareEl: false,
                bgOpacity: 0.85,
                tapToClose: true,
                tapToToggleControls: false,

                galleryUID: galleryElement.getAttribute('data-pswp-uid'),
                getThumbBoundsFn: function(index) {
                    // See Options->getThumbBoundsFn section of docs for more info
                    var thumbnail = items[index].el.children[0],
                        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                        rect = thumbnail.getBoundingClientRect()

                    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width}
                }
            }

            if(fromURL) {
                if(options.galleryPIDs) {
                    // parse real index when custom PIDs are used 
                    // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                    for(var j = 0; j < items.length; j++) {
                        if(items[j].pid == index) {
                            options.index = j
                            break
                        }
                    }
                } else {
                    options.index = parseInt(index, 10) - 1
                }
            } else {
                options.index = parseInt(index, 10)
            }

            // exit if index not found
            if(isNaN(options.index)) {
                return
            }

            if(disableAnimation) {
                options.showAnimationDuration = 0
            }

            // Pass data to PhotoSwipe and initialize it
            gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options)

            // see: http://photoswipe.com/documentation/responsive-images.html
            var realViewportWidth,
                    useLargeImages = false,
                    firstResize = true,
                    imageSrcWillChange

            gallery.listen('beforeResize', function() {
                var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1
                dpiRatio = Math.min(dpiRatio, 2.5)
                realViewportWidth = gallery.viewportSize.x * dpiRatio

                if(realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200 ) {
                    if(!useLargeImages) {
                        useLargeImages = true
                        imageSrcWillChange = true
                    }
                } else {
                    if(useLargeImages) {
                        useLargeImages = false
                        imageSrcWillChange = true
                    }
                }

                if(imageSrcWillChange && !firstResize) {
                    gallery.invalidateCurrItems()
                }

                if(firstResize) {
                    firstResize = false
                }

                imageSrcWillChange = false
            })

            gallery.listen('gettingData', function(index, item) {
                if( useLargeImages ) {
                    item.src = item.o.src
                    item.w = item.o.w
                    item.h = item.o.h
                } else {
                    item.src = item.m.src
                    item.w = item.m.w
                    item.h = item.m.h
                }
            })

            gallery.init()
        }

        // select all gallery elements
        var i = 0;
        this.$photoswipe.each(function() {
            $(this).attr('data-pswp-uid', i + 1)
            $(this).on('click', onThumbnailsClick)
            i++
        })

        // Parse URL and open gallery if it contains #&pid=3&gid=1
        var hashData = photoswipeParseHash()
        if(hashData.pid && hashData.gid) {
            openPhotoSwipe(hashData.pid, this.$photoswipe.get(hashData.gid - 1), true, true)
        }
    }

    // Accordions
    FLATNESS.prototype.initAccordions = function() {
        var _this = this
        _this.$accordions.find('.collapse').on('shown.bs.collapse', function() {
            $(this).parent().find('.icon-plus').removeClass('icon-plus').addClass('icon-minus')
            _this.refresh()
        }).on('hidden.bs.collapse', function() {
            $(this).parent().find('.icon-minus').removeClass('icon-minus').addClass('icon-plus')
            _this.refresh()
        })
    }



    /*------------------------------------------------------------------

      Template Scripts

    -------------------------------------------------------------------*/
    // scroll to top
    FLATNESS.prototype.initScrollTopBtn = function() {
        var _this = this
        
        _this.$scrollTopBtn.on('click', function() {
            $('html, body').stop().animate({scrollTop: 0}, 500, 'swing')
        })
    }
    

    // navbar size
    FLATNESS.prototype.navbarSize = function() {
        var scrollPos    = this.$window.scrollTop()
        var navbarHeight = this.$navbarItems.height()
        var stopIfMax    = scrollPos > this.options.navbarMax && navbarHeight === this.options.navbarMin

        if(stopIfMax) {
            return
        }

        if(scrollPos > this.options.navbarMax) {
            scrollPos = this.options.navbarMax
        }

        // calculate new height of navbar
        var newHeight = (1 - (this.options.navbarMax - scrollPos) / this.options.navbarMax)
            newHeight = this.options.navbarMax - newHeight * (this.options.navbarMax - this.options.navbarMin)

        // set height to navbar
        this.$navbarItems.css({
            height: newHeight + 'px',
            lineHeight: newHeight + 'px'
        })
        this.$navbarHeader.css({
            top: newHeight / 2
        })
    }

    // navbar collapse
    FLATNESS.prototype.navbarCollapse = function() {
        var _this = this

        _this.$navbarToggleBtn.on('click', function() {
            _this.$navbarToggleTarget.toggleClass('collapse')
        })
    }

    // navbar submenu fix
    // no close submenu if click on child submenu toggle
    FLATNESS.prototype.navbarSubmenuFix = function() {
        this.$navbar.on('click', '.dropdown-submenu > a', function(e) {
            e.preventDefault()
            e.stopPropagation()
        })
    }

    // navbar go to small when scroll
    FLATNESS.prototype.navbarScroll = function() {
        var _this = this
        if(issetClass('navbar-fixed') && !issetClass('navbar-small')) {
            _this.$window.on('scroll', function(e) {
                _this.navbarSize()
            })
            _this.navbarSize()
        }
    }


    // init sidebar
    FLATNESS.prototype.initSidebar = function() {
        if(!this.options.stickySidebar) {
            return
        }
        this.$sidebar.addClass('theiaStickySidebar').parent().css({
            'will-change': 'min-height'
        }).theiaStickySidebar({
            additionalMarginTop: (issetClass('navbar-fixed') ? this.options.navbarMin : 0) + 30,
            additionalMarginBottom: 30
        })
    }


    // init same height img
    FLATNESS.prototype.initSameHeightImg = function() {
        var _this = this

        this.$sameHeightImg.each(function() {
            var $postImg = $(this)
            var $img = $postImg.find('img')
            var $cont = $postImg.parent()
            var imgW = $img[0].width
            var imgH = $img[0].height

            function setNewSize() {
                $img.css({
                    width: '',
                    maxWidth: '',
                    marginLeft: ''
                })


                    var aspectRatio = imgH / imgW

                    $postImg.addClass({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    })

                    // change image size
                    var contAspectRatio = $cont.height() / $cont.width()
                    if(contAspectRatio > aspectRatio) {
                        var percent = 100 * (contAspectRatio - aspectRatio) / aspectRatio;
                        $img.css({
                            width: percent + 100 + '%',
                            maxWidth: percent + 100 + '%',
                            marginLeft: (- percent / 2) + '%'
                        })
                    }

            }

            $img.one('load', function() {
                imgW = $img[0].width
                imgH = $img[0].height
                setNewSize()
            })

            _this.$window.on('resize', setNewSize)
            setNewSize()
        })
    }


    // Smooth Scroll
    FLATNESS.prototype.initSmoothAnchorScroll = function() {
        // ------------------------------
        // http://twitter.com/mattsince87
        // ------------------------------
        $('.nav:not(.nav-tabs) a, .smooth-scroll').on('click', function() {
            var section = $($(this).attr('href'))
            var offset = parseFloat($body.attr('data-offset')) || 0

            if(!section.length) {
                return
            }

            // animate
            $('html, body').stop().animate({
                scrollTop: section.offset().top - offset + 1
            }, 900)
            return false
        })
    }

    // ajax form
    FLATNESS.prototype.initAjaxForm = function() {
        this.$ajaxForm.on('submit', function(e) {
            e.preventDefault()
            var $form = $(this)
            var $button = $form.find('[type="submit"]')
            var laddaBtn = $button.data('ladda-button')

            // if disabled button - stop this action
            if($button.is('.disabled') || $button.is('[disabled]')) {
                return
            }

            // button spiner
            if(!laddaBtn) {
                var laddaBtn = Ladda.create($button[0])
                $button.addClass('ladda-button').attr('data-style', 'slide-down')
                $button.data('ladda-button', laddaBtn)
            }

            laddaBtn.start()

            // post erquest
            $.post($(this).attr('action'), $(this).serialize(), function(data, status) {
                    swal({
                        type: 'success',
                        title: 'Success!',
                        text: data,
                        showConfirmButton: true,
                        confirmButtonClass: 'btn-default'
                    })
                    laddaBtn.stop()
                    $form[0].reset()
                })
                .fail(function(data) {
                    swal({
                        type: 'error',
                        title: 'Error!',
                        text: data.responseText,
                        showConfirmButton: true,
                        confirmButtonClass: 'btn-default'
                    })
                    laddaBtn.stop()
                })
        })
    }

    // init fullscreen item
    FLATNESS.prototype.initFullScreenItem = function() {
        var _this = this;

        // test for vh units
        if(typeof Modernizr.cssvhunit === 'undefined') {
            Modernizr.testStyles('#modernizr { height: 50vh; }', function(elem) {
                var height = parseInt(window.innerHeight / 2, 10)
                var compStyle = parseInt((window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle)['height'], 10)

                Modernizr.addTest('cssvhunit', compStyle == height)
            })
        }

        // if support vh units
        if(Modernizr.cssvhunit) {
            _this.$fullscreen.css('height', '100vh')
        }

        // fallback for old browsers
        function fullHeightFallback() {
            _this.$fullscreen.css('height', _this.$window.height())
        }
        if(!Modernizr.cssvhunit) {
            _this.$window.on('load resize', fullHeightFallback)
            fullHeightFallback()
        }
    }

    // init counters
    FLATNESS.prototype.initCounters = function() {
        var _this = this
        
        // set all progress width to 0
        _this.$progressCount.each(function() {
            $(this)
                .attr('data-flatness-count', $(this).attr('data-count') + '%')
                .css('transition', 'none')
                .css('width', 0)
        })
        setTimeout(function() {
            _this.$progressCount.css('transition', '')
        }, 0)

        // set all numbers to 0
        _this.$numberCount.each(function() {
            $(this).attr('data-flatness-count', $(this).attr('data-count') || parseInt($(this).text()))
                .html('0')
        })

        var additionalMarginTop = issetClass('navbar-fixed') ? 80 : 0
        function initCounters() {
            var maxTop = _this.$window.scrollTop() + _this.$window.height()
            var minTop = _this.$window.scrollTop() + additionalMarginTop

            // progress
            _this.$progressCount.filter('[data-flatness-count]').each(function() {
                var $item = $(this)
                var itemTop = $item.offset().top
                if(itemTop <= maxTop && itemTop >= minTop) {
                    $item.css('width', $item.attr('data-flatness-count'))
                    $item.removeAttr('data-flatness-count')
                }
            })

            // number
            _this.$numberCount.filter('[data-flatness-count]').each(function() {
                var $item = $(this)
                var itemTop = $item.offset().top
                if(itemTop <= maxTop && itemTop >= minTop) {
                    $item.prop('Counter', 0).animate({
                        Counter: $item.attr('data-flatness-count')
                    }, {
                        duration: 2000,
                        easing: 'swing',
                        step: function (now) {
                            $(this).text(Math.ceil(now));
                        }
                    });
                    $item.removeAttr('data-flatness-count')
                }
            })
        }

        _this.$window.on('load scroll', initCounters)
        initCounters()
    }


    /*------------------------------------------------------------------

      Init Flatness

    -------------------------------------------------------------------*/
    window.flatness = new FLATNESS( FLATNESS.DEFAULT )

}(jQuery)