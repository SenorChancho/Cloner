/*------------------------------------------------------------------

    Demo script to create settings form to change theme

-------------------------------------------------------------------*/
!function() {
    "use strict";

    var Demo = function(options) {
        this.options         = options;
        this.body            = document.body || document.getElementsByTagName('body')[0];
        this.head            = document.head || document.getElementsByTagName('head')[0];
        this.stylesFlatness  = document.getElementById('css-flatness');
        this.stylesBootstrap = document.getElementById('css-flatness-bootstrap');
        this.settingsBar     = document.createElement('div');
        this.settingsStyles  = document.createElement('style');
        this.init();
    };

    Demo.DEFAULTS = {
        'settings-opened' : true,
        'theme'           : 'dark',
        'navbar-fixed'    : false,
        'navbar-small'    : false,
        'navbar-collapsed': false,
        'smooth-scroll'   : true
    };

    Demo.prototype.init = function() {
        this.restoreData();
        this.update();
        this.updateImagesForTheme();
        this.createSettingsStyles();
        this.createSettingsPanel();
        this.bindings();
    }

    Demo.prototype.storeData = function() {
        if(localStorage) {
            localStorage['flatness-demo-data'] = JSON.stringify( this.options );
        }
    }

    Demo.prototype.restoreData = function() {
        if(localStorage && localStorage['flatness-demo-data'] && localStorage['flatness-demo-data'] != 'undefined') {
            this.options = merge(this.options, JSON.parse( localStorage['flatness-demo-data'] ));
        }
    }

    Demo.prototype.clearData = function() {
        if(localStorage && localStorage['flatness-demo-data'] && localStorage['flatness-demo-data'] != 'undefined') {
            localStorage['flatness-demo-data'] = undefined;
        }
    }

    // change theme and layouts
    Demo.prototype.update = function() {
        for(var n in this.options) {
            var value = this.options[n];
            switch(n) {
                case 'theme':
                    var currentStyle = /-light.min.css$/g.test(this.stylesFlatness.getAttribute('href') || '') ? 'light' : 'dark';
                    if(currentStyle !== value) {
                        if(value === 'light') {
                            this.stylesFlatness.setAttribute('href', this.stylesFlatness.getAttribute('href').replace('.min.css', '-light.min.css'));
                            this.stylesBootstrap.setAttribute('href', this.stylesBootstrap.getAttribute('href').replace('.min.css', '-light.min.css'));
                        } else {
                            this.stylesFlatness.setAttribute('href', this.stylesFlatness.getAttribute('href').replace('-light.min.css', '.min.css'));
                            this.stylesBootstrap.setAttribute('href', this.stylesBootstrap.getAttribute('href').replace('-light.min.css', '.min.css'));
                        }
                    }
                    break;
                case 'navbar-fixed':
                case 'navbar-small':
                case 'navbar-collapsed':
                    if(value) {
                        addClass(this.body, n);
                    } else {
                        removeClass(this.body, n);
                    }
                    break;
                case 'smooth-scroll':
                    if(!value) {
                        bind(document, 'DOMContentLoaded', function() {
                            SmoothScroll.destroy();
                        });
                    }
            }
        }
    }

    // update images for theme color (dark images in light theme)
    Demo.prototype.updateImagesForTheme = function() {
        var _this = this;

        function changeImg(img) {
            if(img && /-light/i.test(img.src) && _this.options.theme === 'light') {
                img.src = img.src.replace('-light', '-dark');
            }
        }
        
        // after document ready
        bind(document, 'DOMContentLoaded', function() {
            var dividers = getElementsByClassName(document, 'post-divider');
            var partners = getElementsByClassName(document, 'flatness-carousel');

            for(var k = 0, len = dividers.length; k < len; k++) {
                changeImg(dividers[k].getElementsByTagName('img')[0]);
            }
            for(k = 0, len = partners.length; k < len; k++) {
                var imgs = partners[k].getElementsByTagName('img');
                for(var n = 0, lenN = imgs.length; n < lenN; n++) {
                    changeImg(imgs[n]);
                }
            }
        })
    }

    // create settings panel
    Demo.prototype.createSettingsPanel = function() {
        var opts = this.options;

        this.settingsBar.id = 'flatness-demo-bar';
        if(this.options['settings-opened']) {
            this.settingsBar.className = 'flatness-demo-show';
        }
        this.settingsBar.innerHTML = [
            '<div id="flatness-demo-toggle"><span class="ion-gear-a"></span></div>',
            '<h3 class="text-center mt-0 mb-20">Theme Settings</h3>',
            'Color:',
            '<div class="radio mb-20">',
            '   <label><input data-reload type="radio" name="flatness-demo-theme" value="dark" ' + (opts.theme=='dark'?'checked':'') + '>Dark</label>',
            '   <label class="ml-20"><input data-reload type="radio" name="flatness-demo-theme" value="light" ' + (opts.theme=='light'?'checked':'') + '>Light</label>',
            '</div>',
            'Layout:',
            '<div class="checkbox">',
            '   <label><input type="checkbox" data-reload name="flatness-demo-navbar-fixed" ' + (opts['navbar-fixed']?'checked':'') + '>Sticky navbar</label>',
            '</div>',
            '<div class="checkbox">',
            '   <label><input type="checkbox" data-reload name="flatness-demo-navbar-small" ' + (opts['navbar-small']?'checked':'') + '>Small navbar</label>',
            '</div>',
            '<div class="checkbox mb-20">',
            '   <label><input type="checkbox" name="flatness-demo-navbar-collapsed" ' + (opts['navbar-collapsed']?'checked':'') + '>Collapsed navbar</label>',
            '</div>',
            'Settings: <span></span>',
            '<div class="checkbox">',
            '   <label><input type="checkbox" data-reload name="flatness-demo-smooth-scroll" ' + (opts['smooth-scroll']?'checked':'') + '>Smooth scroll</label>',
            '</div>',
            '<div class="mt-20"><a href="#!" id="flatness-demo-local-clear">Reset to default</a></div>'
        ].join('\n');
        this.body.appendChild(this.settingsBar);
    }

    // create styles for settings panel
    Demo.prototype.createSettingsStyles = function() {
        var css = [
                '#flatness-demo-bar {',
                '    position: fixed;',
                '    color: #fff;',
                '    padding: 3rem;',
                '    bottom: 0px;',
                '    left: -250px;',
                '    width: 250px;',
                '    background-color: #362f40;',
                '    -webkit-box-shadow: 0 0 35px 0 transparent;',
                '    box-shadow: 0 0 35px 0 transparent;',
                '    -webkit-transition: .3s left ease-in-out, .3s -webkit-box-shadow ease-in-out;',
                '    transition: .3s left ease-in-out, .3s box-shadow ease-in-out, .3s -webkit-box-shadow ease-in-out;',
                '    z-index: 1062;',
                '}',
                '#flatness-demo-bar.flatness-demo-show {',
                '    left: 0px;',
                '    -webkit-box-shadow: 0 0 35px 0 #1F1C29;',
                '    box-shadow: 0 0 35px 0 #1F1C29;',
                '}',
                '#flatness-demo-toggle {',
                '    position: absolute;',
                '    cursor: pointer;',
                '    bottom: 0;',
                '    right: -50px;',
                '    width: 50px;',
                '    height: 50px;',
                '    font-size: 3rem;',
                '    text-align: center;',
                '    background-color: #362f40;',
                '}'
            ].join('\n'),
            style = document.createElement('style');

        style.id   = 'flatness-demo-styles';
        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        this.head.appendChild(style);
    }

    Demo.prototype.bindings = function() {
        var _this = this;

        // toggle settings
        bind(document.getElementById('flatness-demo-toggle'), 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if(hasClass(_this.settingsBar, 'flatness-demo-show')) {
                removeClass(_this.settingsBar, 'flatness-demo-show');
                _this.options['settings-opened'] = false;
            } else {
                addClass(_this.settingsBar, 'flatness-demo-show');
                _this.options['settings-opened'] = true;
            }
            _this.storeData();
        });
        bind(_this.settingsBar, 'click', function(e) {
            e.stopPropagation();
        });
        bind(document, 'click', function(e) {
            if(hasClass(_this.settingsBar, 'flatness-demo-show')) {
                removeClass(_this.settingsBar, 'flatness-demo-show');
                _this.options['settings-opened'] = false;
                _this.storeData();
            }
        });

        // settings change
        bind(_this.settingsBar.getElementsByTagName('input'), 'change', function(e) {
            var name = this.name.replace('flatness-demo-', '');
            var val = this.type == 'checkbox' ? this.checked : this.value;
            var reload = this.getAttribute('data-reload') !== null;

            _this.options[name] = val;
            _this.storeData();

            if(reload) {
                window.location.href = window.location.href;
            } else {
                _this.update();
            }
        })

        // clear local storage
        bind(document.getElementById('flatness-demo-local-clear'), 'click', function(e) {
            e.preventDefault();
            _this.clearData();
            window.location.href = window.location.href;
        });
    }

    function bind(el, ev, fn){
        if(el.length) {
            for(var k = 0, n = el.length; k < n; k++) {
                bind(el[k], ev, fn);
            }
            return;
        }
        if(window.addEventListener){ // modern browsers including IE9+
            el.addEventListener(ev, fn, false);
        } else if(window.attachEvent) { // IE8 and below
            el.attachEvent('on' + ev, fn);
        } else {
            el['on' + ev] = fn;
        }
    }

    function getElementsByClassName(node, classname) {
        if (node.getElementsByClassName) { // use native implementation if available
            return node.getElementsByClassName(classname);
        } else {
            return (function getElementsByClass(searchClass,node) {
                if (node == null) {
                    node = document;
                }
                var classElements = [],
                    els = node.getElementsByTagName("*"),
                    elsLen = els.length,
                    pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)"), i, j;

                for (i = 0, j = 0; i < elsLen; i++) {
                    if (pattern.test(els[i].className)) {
                        classElements[j] = els[i];
                        j++;
                    }
                }
                return classElements;
          })(classname, node);
        }
    }

    function hasClass(o, c) {
        var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
        return re.test(o.className);
    }

    function addClass(o, c){
        if (hasClass(o, c)) return;
        o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
    }
    
    function removeClass(o, c){
        var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
        o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
    }

    // merge objects recursive
    function merge(obj1, obj2) {
        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if ( obj2[p].constructor==Object ) {
                    obj1[p] = merge(obj1[p], obj2[p]);
                } else {
                    obj1[p] = obj2[p];
                }
            } catch(e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    }

    var demobar = new Demo(Demo.DEFAULTS);
}();