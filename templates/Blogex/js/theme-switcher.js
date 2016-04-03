$(function($) {
    "use strict";

    $(window).on('load', function() {
        var themeUrl = '<link id="themes-color" href="css/theme-color.css" type="text/css" rel="stylesheet">'
        $('.wide-view').addClass('active')
        $(themeUrl).appendTo('head');

    });

    var tgl = "0";

    function fnPanelTgl() {
        if (tgl == "0") {
            $('.style-switcher').addClass('panel-merge')
            return tgl = "1";
        } else if (tgl == "1") {

            $('.style-switcher').removeClass('panel-merge')
            return tgl = "0";
        }
    }


    $('.cl-item').each(function() {
        var themeColor = $(this).data('color');
        $(this).css({
            'background-color': themeColor
        })
    });
    $('.pat-item').each(function() {
        var themePat = $(this).data('src');
        $(this).css({
            'background-image': 'url(' + themePat + ')'
        })
    });

    $('.bg-item').each(function() {

        var themeBgthumb = $(this).data('thumb');
        $(this).css({
            'background-image': 'url(' + themeBgthumb + ')'
        })
    });


    $('.pat-item').on('click', function() {
        var themePat = $(this).data('src');
        $('body').css({
            'background-image': 'url(' + themePat + ')',
            'background-repeat': 'repeat',
            'background-attachment': 'fixed',
            'background-size': 'normal'
        })
    });

    $('.bg-item').on('click', function() {
        var themeBg = $(this).data('src');
        var themeBgthumb = $(this).data('thumb');
        $('body').css({
            'background-image': 'url(' + themeBg + ')',
            'background-repeat': 'no-repeat',
            'background-size': 'cover',
            'background-attachment': 'fixed'
        })
    });



    $('.cl-item').click(function() {
        var stylesheet = $(this).attr('title').toLowerCase();
        $('#themes-color').attr('href', 'css' + '/' + stylesheet + '.css');
    });



    $('.side-toggle').on('click', function(e) {
        e.preventDefault();
        fnPanelTgl();
    });

    $('.wide-view').on('click', function(ev) {
        ev.preventDefault();
        if ($('body').hasClass('boxed')) {
            $('body').removeClass('boxed');
            $(this).addClass('active')
            $('.boxed-view').removeClass('active')
        }
    });

    $('.boxed-view').on('click', function(evn) {
        evn.preventDefault();
        $('body').addClass('boxed')
        $(this).addClass('active')
        $('.wide-view').removeClass('active')
    });



});