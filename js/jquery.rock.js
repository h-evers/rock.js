// jquery plugin
(function ($) {
    $.fn.rocks = function (options) {
        var settings = {
            optionClass: 'option',
            optionsClass: 'options',
            optClass: 'opt',
            onChange: function () {}
        };
        var methods = {
            buildLi: function (element) {
                return $('<li />', {
                    'class': settings.optionClass


                }).append($('<button />', {
                    text: $(element).text()
                }).data('val', $(element).val()));
            },
            close: function ($rock) {

                $rock.removeClass('open');
                $('html').unbind('click.rock');
            },
            open: function ($rock) {

                $rock.addClass('open');
                $('html').one({
                    'click.rock': function () {
                        methods.close($rock);
                    },
                    'keyup': function (e) {
                        if (e.keyCode == 27) {
                            methods.close($rock);
                        }
                    }
                });
            }
        };
        return this.each(function () {

            if (options) {
                $.extend(settings, options);
            }
            var $this = $(this);
            var $rock = null;
            var ul = $('<ul />', {
                'class': 'rockdown'
            });
            $('<li />').append($('<button />', {
                text: $this.find(':selected').text(),
                'class': 'handle'

            }).bind('click.rock', function (e) {
                e.stopPropagation();
                if ($rock.hasClass('open')) {
                    methods.close($rock);
                }
                else {
                    methods.open($rock);
                }


            })).appendTo(ul);

            var ulul = $('<ul />', {
                'class': settings.optionsClass
            });
            $this.children('option:not(:selected),optgroup').each(function () {
                if ($(this).is('optgroup')) {
                    ulul.append($('<li />', {
                        'class': settings.optClass
                    }).append($('<span />', {
                        text: $(this).attr('label')
                    })));
                    var ululul = $('<ul />');
                    $(this).children().each(function () {
                        methods.buildLi(this).appendTo(ululul);
                    });
                    ulul.find('li.' + settings.optClass + ':last').append(ululul);
                }
                else {
                    methods.buildLi(this).appendTo(ulul);
                }
                ul.append(ulul);
            });
            $rock = ul.delegate('li.option button', 'click.rock', function (e) {
                $this.val($(e.target).data('val'));

                ul.find('button.handle').text($(e.target).text());
                methods.close($rock);
                settings.onChange.call($this);
            }).insertAfter($this);

            $this.bind('change', function () {
                $this = $(this);
                ul.find('button.handle').text($this.find('option[value=' + $this.val() + ']').text());
            });


        });
    };
})(jQuery);