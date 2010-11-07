// jquery plugin
(function ($) {
    $.fn.rocks = function (options) {
        var settings = {
            optionClass: 'option',
            optClass: 'opt',
            onChange: function () {}
        };
        var methods = {
            buildLi: function (element) {
                return $('<li />', {
                    'class': settings.optionClass,
                    text: $(element).text()
                });
            }
        };
        return this.each(function () {
            if (options) {
                $.extend(settings, options);
            }
            var $this = $(this).hide();
            var ul = $('<ul />', {
                'class': 'rockdown'
            });
            $('<li />').append($('<span />', {
                'class': 'handle',
                text: $this.find(':selected').text()
            })).appendTo(ul);
            var ulul = $('<ul />', {
                'class': settings.optionClass
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
                        methods.buildLi(this).data('val', $(this).val()).appendTo(ululul);
                    });
                    ulul.find('li.' + settings.optClass + ':last').append(ululul);
                }
                else {
                    methods.buildLi(this).data('val', $(this).val()).appendTo(ulul);
                }
                ul.append(ulul);
            });
            ul.delegate('li.option', 'click.rock', function (e) {
                $this.val($(e.target).data('val'));
                ul.find('span.handle').text($(e.target).text());
                settings.onChange.call($this);
            }).bind('click.rock', function () {
                $(this).toggleClass('open');
            });
            $('body').append(ul);
        });
    };
})(jQuery);