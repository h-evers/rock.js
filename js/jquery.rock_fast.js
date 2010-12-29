// jquery plugin
(function ($) {
    $.fn.rock_fast = function (options) {
        var settings = {
            optionClass: 'option',
            optionsClass: 'options',
            optClass: 'opt',
            openClass: 'open',
            mobileClass: 'rjsmo',
            searchTimeout: 1000,
            onChange: function () {
            }
        },
                timeout = [],
            // big stack for all rockjs <ul>
                rocks = [],
            // private methods
                methods = {
                    buildLi: function ($element) {
                        return '<li role="option" data-value="' + $element.attr('value') + '" class="' + settings.optionClass + '"><button>' + $element.text() + '</button></li>';
                    },
                    
                    // close a single <ul>
                    close: function ($rock) {
                        $rock.element.removeClass(settings.openClass);
                        $rock.open = false;
                        $(document).unbind('click.rock').unbind('keyup.rock');
                    },
                    // close all and open the clicked one
                    open: function ($rock) {
                        // close them all and remove the events
                        $(document).unbind('click.rock').unbind('keyup.rock');
                        $.each(rocks, function () {
                            this.element.removeClass(settings.openClass);
                            this.open = false;
                        });
                        // open it
                        $rock.element.addClass(settings.openClass);
                        $rock.element.find('ul li button.active').focus();
                        $rock.open = true;

                        $(document).bind({
                            // close on a click outside
                            'click.rock': function () {
                                methods.close($rock);
                            },
                            // close on pressing ESC
                             'keyup.rock': function (e) {
                                if (e.keyCode === 27) {
                                    methods.close($rock);
                                }
                            }
                        });
                    }
                };
        // the magic starts here 
        return this.each(function () {
            var $this = $(this),
                    $rock = {
                        'buttons': []
                    },
                    enter,
                    // array for html result
                    html = [],
                    $ul = $('<ul/>',{'class':'rockdown'});
            
            // if element is no <select>, quit
            if (!$this.is('select')) {
                return (jQuery);
            }
            // if iphone or android, don't replace select
            if (navigator.userAgent.toLowerCase().match(/(iphone|android)/)) {
                $('body').addClass(settings.mobileClass);
                // exit
                return (jQuery);
            }
            // set custom settings
            if (options) {
                $.extend(settings, options);
            }
            // hide <select> element in dom
            $this.hide();
            // save the text for more performance
            $rock.handleText = $this.find('option:selected').text();
            // build html
            html.push('<li><button class="handle" aria-valuetext="' + $rock.handleText + '">' + $rock.handleText + '</button></li>');
            html.push('<li>');
            html.push('<ul class="' + settings.optionsClass + '">');
            // find all <option> and <optgroup>
            $this.children().each(function () {
                // <option> OR <optgroup>
                var $this = $(this);
                // hey, it's an <optgroup>
                if ($this.is('optgroup')) {
                    html.push('<li class="' + settings.optClass + '"><span>' + $this.attr('label') + '</span>');
                    html.push('<ul>');
                    // loop the nested <option> elements
                    $this.children('option').each(function () {
                        var $nestedOption = $(this);
                        html.push(methods.buildLi($nestedOption));
                    });
                    html.push('</ul>');
                    html.push('</li>');
                }
                // it's an <option>
                else {
                    html.push(methods.buildLi($this));
                }
            });
            html.push('</ul>');
            html.push('</li></ul>');

            // simulate the click on the linked label
            $('label[for='+$this.attr('name')+']').bind('click.rock',function(){
                $ul.find('button.handle').focus();
            });
            // a lot of event delegation for the ul
            $rock.element = $ul
                    // click on a button
                    .delegate('li.option button', 'click.rock', function (e) {

                        var $target = $(e.target);
                        // remove the active class from old element
                        $ul.find('li button.active').removeClass('active');
                        // set <select> value
                        $this.val($target.addClass('active').parent().attr('data-value'));
                        // change text on handle
                        $ul.find('button.handle').text($target.text()).attr('aria-valuetext', $target.text());
                        // close it
                        methods.close($rock);
                        // fire callback
                        settings.onChange.call($this);
                    })
                    // key event
                    .delegate('li.option button,button.handle', 'keydown.rock', function (e) {
                    // arrow down or arrow up is pressed
                    if (e.keyCode === 40 || e.keyCode === 38) {
                        e.preventDefault();
                        // find the clicked button in the array, not in the DOM
                        $rock.buttons.each(function (index, value) {
                            // button found
                            if (e.target === value) {
                                // arrow down ⇩
                                if (e.keyCode === 40) {
                                    // just be sure, there is a next button
                                    if (index + 1 < $rock.buttons.length) {
                                        // go to next element and focus it, for ie6 we should add a hover class
                                        $rock.buttons.get(index + 1).focus();
                                    }
                                }
                                // arrow up ↑
                                else {
                                    // if we are on the first element, just do nothing
                                    if (index > 0) {
                                        $rock.buttons.get(index - 1).focus();
                                    }
                                }
                            }
                        });
                    }
                    //clear all timeouts
                    $.each(timeout, function () {
                        window.clearTimeout(this);
                    });
                    var id = window.setTimeout(function () {
                        enter = '';
                    }, settings.searchTimeout);
                    timeout.push(id);
                    enter = enter + String.fromCharCode(e.keyCode);
                    $rock.buttons.each(function (index, value) {
                        var $this = $(this);
                        $rock.$last = $this;
                        if ($this.text().toLowerCase().indexOf(enter.toLowerCase()) === 0) {
                            if (!$rock.open) {
                                $this.trigger('click.rock');
                            }
                            else {
                                $this.hover().focus();
                            }
                        }
                        // nothing found
                    });
                })
                .delegate('ul li.' + settings.optionClass, 'mouseover', function () {
                    $(this).find('button').focus();
                })
                .delegate('button.handle', 'click.rock', function (e) {
                    // don't bubble
                    $ul.find('button.handle').focus();
                    e.stopPropagation();
                    // please close it
                    if ($rock.open) {
                        methods.close($rock);
                    }
                    // please open it
                    else {
                        methods.open($rock);
                    }
                })
                .delegate('button.handle', 'keyup.rock', function (e) {

                    // arrow down
                    if (e.keyCode === 40) {
                        // open it
                        if (!$rock.open) {
                            methods.open($rock);
                        }
                        // if it's open, go to first element
                        else {
                            $rock.element.find('li.option:first button').focus();
                        }
                    }
                });
                // inject a lot of html to the <ul class="rockdown">
                $ul.append(html.join(""));

                // save all buttons in array
                $rock.buttons = $ul.find('li.' + settings.optionClass + ' button');

                // inject the <ul class="rockdown"> in the dom, after the hidden <select>
                $this.after($ul);
                // nice to have: do it bidirectional
                $this.bind('change', function () {
                    var $this = $(this);
                    var value = $this.val();
                    $ul.find('button.handle').text($this.find('option[value=' + value + ']').first().text())
                            .end()
                         .find('ul li[data-value='+value+'] button').addClass('active');
                    
            });
            // push all replaced <select> to stack
            rocks.push($rock);
        });
    };
})(jQuery);