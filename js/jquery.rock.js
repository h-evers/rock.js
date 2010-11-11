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


                }).append($('<button />',{
                     text: $(element).text()
                }).data('val', $(element).val()));
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
                'class': 'handle'

            }).append($('<button />',{
                     text: $this.find(':selected').text()
                }))).appendTo(ul);
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
                        methods.buildLi(this).appendTo(ululul);
                    });
                    ulul.find('li.' + settings.optClass + ':last').append(ululul);
                }
                else {
                    methods.buildLi(this).appendTo(ulul);
                }
                ul.append(ulul);
            });
            ul.delegate('li.option button', 'click.rock', function (e) {
                $this.val($(e.target).data('val'));
                ul.find('span.handle button').text($(e.target).text());
                settings.onChange.call($this);
            }).bind('click.rock', function () {
                $(this).toggleClass('open');
            }).insertAfter($this);

            $this.bind('change',function(){
               $this = $(this);
               ul.find('span.handle').text($this.find('option[value='+$this.val()+']').text());
            });

        });
    };
})(jQuery);