// jquery plugin
(function ($) {
    $.fn.rocks = function (options) {
        var settings = {
            optionClass: 'option',
            optionsClass: 'options',
            optClass: 'opt',
            openClass: 'open',
            mobileClass: 'rjsmo',
            mobileClassWP7: 'rjswp7',
            plainClass: 'rjsplain',
            searchTimeout: 1000,
            handleClass: '',
            handleMarkup: '',
            replace: false,
            replaceChars: {
                '(': '<span>',
                ')': '</span>'
            },
            onChange: function () {}
        },
            timeout = [],
            // big stack for all rockjs <ul>
            rocks = [],
            // private methods
/*isCheckboxChecked = function ($checkbox) {
                    return $checkbox.is(':checked');
                },
                checkCheckbox = function ($checkbox) {
                    $checkbox.data('checked', true);
                    $checkbox.attr('checked', true);
                },
                uncheckCheckbox = function ($checkbox) {
                    $checkbox.data('checked', false);
                    $checkbox.attr('checked', false);
                },
                toggleButton = function ($checkbox, $button) {
                    if ($checkbox.data('checked')) {
                        $button.addClass('checked');
                    } else {
                        $button.removeClass('checked');
                    }
                }, */
            parseText = function (text) {
                $.each(settings.replaceChars, function (index, value) {
                    text = text.replace(index, value);
                });
                return text;
            },
            buildLi = function ($element) {
                var text = $element.text();
                if (settings.replace) {
                    text = parseText(text);
                }
                return '<li role="option" data-value="' + $element.attr('value') + '" class="' + settings.optionClass + '"><button>' + text + '</button></li>';
            },
            changeHandleTextAndAria = function($element,text){

                if(settings.handleMarkup!==''){
                    $element.find('*:not(:has("*"))').text(text);
                    }
                else {
                        $element.text(text);
                }
            },
            // close a single <ul>
            close = function (rock) {
                rock.$element.removeClass(settings.openClass);
                rock.open = false;
                $(document).unbind('click.rock').unbind('keyup.rock');
            },
            // close all and open the clicked one
            open = function (rock) {
                // close them all and remove the events
                $(document).unbind('click.rock').unbind('keyup.rock');
                $.each(rocks, function () {
                    this.$element.removeClass(settings.openClass);
                    this.open = false;
                });
                // open it
                rock.$element.addClass(settings.openClass).find('ul li button.active').focus();
                rock.open = true;
                $(document).bind({
                    // close on a click outside
                    'click.rock': function (e) {
                        // check, if we are inside, needed for windows firefox
                        if (!$.contains(rock.$element[0],e.target)) {

                            close(rock);
                        }
                    },
                    // close on pressing ESC
                    'keyup.rock': function (e) {
                        if (e.which === 27) {
                            close(rock);
                        }
                    }
                });
            };
        // the magic starts here
        return this.each(function () {
            var $this = $(this);
            // if element is no <select>, quit
/*if ($this.is('input[type=checkbox]')) {
                var $button;
                $button = $('<button/>', {
                    click: function () {
                        toggleButton($this, $button);
                        if (isCheckboxChecked($this)) {
                            uncheckCheckbox($this);
                        } else {
                            checkCheckbox($this);
                        }
                    },
                    text: '✓'
                });
                toggleButton($this, $button);
                $this.bind('change', function () {
                    toggleButton($this, $button);
                }).after($button);
                // /return (jQuery);
            }*/


            if ($.data(this, 'rock')) {

                return jQuery;
            } else if ($this.is('select')) {


                var rock = {
                     buttons: [],
                     $handle:'rr'
                },
                    enter = '',
                    // array for html result
                    html = [],
                    $ul = $('<ul/>', {
                        'class': 'rockdown'
                    }),
                    // if iphone, android or windows phone 7, don't replace select
                    userAgent = navigator.userAgent.toLowerCase();

                if (userAgent.match(/(iphone|android|xblwp7|IEMobile)/)) {
                    $this.addClass(settings.plainClass);
                    $(document.body).addClass(settings.mobileClass);
                    if (userAgent.match(/(xblwp7|IEMobile)/)) {
                        $(document.body).addClass(settings.mobileClassWP7);
                    }
                    // exit
                    return (jQuery);
                }
                // set custom settings
                if (options) {
                    $.extend(settings, options);
                }
                // hide <select> element in dom
                //$this.hide();
                // save the text for more performance
                rock.handleText = $this.find('option:selected').text();
                // build html
                html.push('<li><button class="handle ' + settings.handleClass + '" aria-valuetext="' + rock.handleText + '">' + rock.handleText + '</button></li>');
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
                            html.push(buildLi($nestedOption));
                        });
                        html.push('</ul>');
                        html.push('</li>');
                    } else {
                        // it's an <option>
                        html.push(buildLi($this));
                    }
                });
                html.push('</ul>');
                html.push('</li></ul>');
                // simulate the click on the linked label
                $('label[for=' + $this.attr('name') + ']').bind('click.rock', function (e) {
                    e.preventDefault();
                    $ul.find('button.handle').focus();
                });
                // a lot of event delegation for the ul

                rock.$element = $ul
                // click on a button
                .delegate('li.option button', 'mousedown.rock', function (e) {
                    var $target = $(e.target);
                    // remove the active class from old element
                    $ul.find('li button.active').removeClass('active');
                    // set <select> value
                    $this.val($target.addClass('active').parent().attr('data-value'));
                    // change text on handle

                    changeHandleTextAndAria(rock.$handle,$target.text());
                    // close it
                    close(rock);
                    // fire callback
                    settings.onChange.call($this);
                }).delegate('li.option button', 'mouseup.rock', function (e) {
                    $(this).trigger('mousedown');
                })
                // search, navigate on key event on a button or the handler
                .delegate('li.option button,button.handle', 'keydown.rock', function (e) {
                    if (e.which === 40 || e.which === 38) {
                        enter = '';
                        e.preventDefault();
                        // find the clicked button in the array, not in the DOM
                        rock.buttons.each(function (index, value) {
                            // button found
                            if (e.target === value) {
                                // arrow down ⇩
                                if (e.which === 40) {
                                    // just be sure, there is a next button
                                    if (index + 1 < rock.buttons.length) {
                                        // go to next element and focus it, for ie6 we should add a hover class
                                        rock.buttons.get(index + 1).focus();
                                    }
                                }
                                if (e.which === 38) {
                                    // arrow up ↑
                                    // if we are on the first element, just do nothing
                                    if (index > 0) {
                                        rock.buttons.get(index - 1).focus();
                                    }
                                }
                            }
                        });
                    } else {
                        //clear all timeouts
                        $.each(timeout, function () {
                            window.clearTimeout(this);
                        });
                        var id = window.setTimeout(function () {
                            enter = '';
                        }, settings.searchTimeout);
                        timeout.push(id);
                        enter = enter + String.fromCharCode(e.which);
                        rock.buttons.each(function (index, value) {
                            var $this = $(this);
                            rock.$last = $this;
                            if ($this.text().toLowerCase().indexOf(enter.toLowerCase()) === 0) {
                                if (!rock.open) {
                                    $this.trigger('click.rock');
                                } else {
                                    $this.hover().focus();
                                }
                                return false;
                            }
                            // else nothing found
                        });
                    }
                }).delegate('ul li.' + settings.optionClass, 'mouseover', function () {
                    $(this).find('button').focus();
                })
                // events on the handle
                .delegate('button.handle', 'mousedown.rock', function (e) {
                    e.preventDefault();
                    $ul.find('button.handle').focus();

                    // please close it
                    if (rock.open) {
                        close(rock);
                    } else {
                        // please open it
                        open(rock);
                    }
                }).delegate('button.handle', 'mouseup.rock', function (e) {
                    $(this).trigger('click');
                    e.preventDefault();
                }).delegate('button.handle', 'keyup.rock', function (e) {
                    // arrow down
                    if (e.which === 40 || e.which === 32) {
                        // open it
                        if (!rock.open) {
                            open(rock);
                        } else {
                            // if it's open, go to first element
                            rock.$element.find('li.option:first button').focus();
                        }
                    }
                });



                // inject a lot of html to the <ul class="rockdown">
                $ul.append(html.join(""));

                rock.$handle = $ul.find('button.handle');


                // add custom markup
                rock.$handle.wrapInner($(settings.handleMarkup));
                // save all buttons in array
                rock.buttons = $ul.find('li.' + settings.optionClass + ' button');
                // inject the <ul class="rockdown"> in the dom, after the hidden <select>
                $this.after($ul);
                // nice to have: do it bidirectional
                $this.bind('change', function () {
                    var $this = $(this);
                    var value = $this.val();
                    var text = $this.find('option[value=' + value + ']').first().text();
                    changeHandleTextAndAria(rock.$handle,text);
                    $ul.find('ul li[data-value=' + value + '] button').addClass('active');
                });
                // push all replaced <select> to stack
                rocks.push(rock);
                $.data(this, 'rock', rock);
            }
            // it's not rockable
            else {
                return jQuery;
            }
        });
    };
}(jQuery));