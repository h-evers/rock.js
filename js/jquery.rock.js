// jquery plugin
(function ($) {
	$.fn.rocks = function (options) {
		var settings = {
			optionClass: 'option',
			optionsClass: 'options',
			optClass: 'opt',
            openClass: 'open',
			onChange: function () {}
		};
        var rocks = [];
		var methods = {
			buildLi: function (element) {
				return $('<li />', {
					'class': settings.optionClass
				}).append($('<button />', {
					text: $(element).text()
				}).data('val', $(element).val()));
			},
			close: function ($rock) {
				$rock.element.removeClass(settings.openClass);
                $rock.open = false;
				$('html').unbind('click.rock');
			},
			open: function ($rock) {
				$.each(rocks,function(){
                   this.element.removeClass(settings.openClass);
                   this.open = false;
                });

                $rock.element.addClass(settings.openClass);
                $rock.open = true;
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

            // check
            if(!$this.is('select')){
                return;
            }

			var $rock = {};
			var ul = $('<ul />', {
				'class': 'rockdown'
			});
			$('<li />').append($('<button />', {
				text: $this.find(':selected').text(),
				'class': 'handle'
			}).bind({
				'click.rock': function (e) {
					e.stopPropagation();
					if ($rock.open) {
						methods.close($rock);
					}
					else {
						methods.open($rock);
					}
				},
				keyup: function (e) {
					if (e.keyCode == 40) {
						if(!$rock.open){
                            methods.open($rock);
                        }
                        else {
                            $rock.element.find('li.option:first button').focus();    
                        }

					}
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
			});
			ul.append($('<li />').append(ulul));
			$rock.element = ul.delegate('li.option button', 'click.rock', function (e) {
				$this.val($(e.target).data('val'));
				ul.find('button.handle').text($(e.target).text());
				methods.close($rock);
				//callback
                settings.onChange.call($this);
			}).delegate('li.option button', 'keyup', function (e) {
				var $buttons = $rock.element.find('button');
                // arrow down
                if (e.keyCode === 40) {
					$buttons.each(function (index, value) {
						if (e.target === value) {
							if (index + 1 < $buttons.length) {
								$buttons.get(index + 1).focus();
							}
						}
					});
				}
                //arrow up
				if (e.keyCode === 38) {
					$buttons.each(function (index, value) {
						if (e.target === value) {
							if (index - 1 > 0) {
								$buttons.get(index - 1).focus();
							}
						}
					});
				}
			}).insertAfter($this);
			$this.bind('change', function () {
				$this = $(this);
				ul.find('button.handle').text($this.find('option[value=' + $this.val() + ']').text());
			});
		rocks.push($rock); 
        });
	};
})(jQuery);