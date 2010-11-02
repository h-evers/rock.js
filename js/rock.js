$(document).ready(function () {

    $('select').rocks();


    $("ul.rockdown").click(function () {
        $(this).toggleClass("open");
    });
});


// jquery plugin
(function ($) {
    $.fn.rocks = function () {
        
        return this.each(function () {
            var $this = $(this);
     
            var ul = $('<ul />', {
                'class': 'rockdown'
            });

            $('<li />').append($('<span />', {
                'class': 'handle',
                text: $this.find(':selected').text()
            })).appendTo(ul);

            var ulul = $('<ul />', {
                'class': 'options'
            });

            $this.children('option:not(:selected),optgroup').each(function () {
                if ($(this).is('optgroup')) {
                    ulul.append($('<li />', {
                        'class': 'opt'
                    }).append($('<span />', {
                        text: $(this).attr('label')
                    })));
                    var ululul = $('<ul />');
                    $(this).children().each(function () {
                        $('<li />', {
							'class':'option',
							title: $(this).val(),
                            text: $(this).text()
                        }).appendTo(ululul);
                    });
                    ulul.find('li.opt:last').append(ululul);
                }
                else {
                    $('<li />', {
                        text: $(this).text(),
                        	title: $(this).val(),
                        'class': 'option'
                    }).appendTo(ulul);
                }
                ul.append(ulul);
            });
            ul.delegate('li.option','click.rock',function(e){
					$this.val($(e.target).attr('title'));
					ul.find('span.handle').text($(e.target).text());
				});
            $('body').append(ul);
        });
    };
})(jQuery);