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
		// Stack, in dem alle Dropdowns liegen
        var rocks = [];
		// Private Methoden
		var methods = {
			// Baut Listenpunkte (options) zusammen
			buildLi: function (element) {
				return $('<li />', {
					'class': settings.optionClass,
					'role': 'option'
				}).append($('<button />', {
					text: $(element).text()
				}).data('val', $(element).val()));
			},
			// Schließt einzelnes Rockdown
			close: function ($rock) {
				$rock.element.removeClass(settings.openClass);
                $rock.open = false;
				$('html').unbind('click.rock');
			},
			// Schließt alle Rockdowns und öffnet das übergebene
			open: function ($rock) {
				$.each(rocks,function(){
                   this.element.removeClass(settings.openClass);
                   this.open = false;
                });

                $rock.element.addClass(settings.openClass);
                $rock.open = true;
				// Einmaliges, delegiertes Event zum schließen bei click in document oder esc
				$(document).one({
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
		// Wird für jedes übergebene Element (rocks) ausgeführt
		return this.each(function () {
			// Überschreibt options falls angegeben
            if (options) {
				$.extend(settings, options);
			}
			// Speichert aktuelles jQuery-Objekt in $this
			var $this = $(this);

            // Steigt aus, ob es sich überhaupt um ein select handelt
			// Kann später als Elementweiche benutzt werden
			// Object dürfte dadurch nicht mehr chainable sein
            if(!$this.is('select')){
                return;
            }
			
			// $rock enthält Element ($this) und Zustand (z.B. open)
			// Hat noch Platz für mehr ;-)
			var $rock = {};
			// Baut rockdown-ul auf, hängt noch nicht im DOM
			var ul = $('<ul />', {
				'class': 'rockdown'
			});
			// Baut handle zusammen (der Teil, der im geschlossenen Zustand zu sehen ist)
			var $handleValue = $this.find(':selected').text();
			$('<li />').append($('<button />', {
				text: $handleValue,
				'class': 'handle',
				'aria-valuetext': $handleValue
			// Bindet öffnen und schließen
			}).bind({
				'click.rock': function (e) {
					// verhindert bubbleing, damit z.B. ein treffer an document das rockdown nicht wieder schließt  
					e.stopPropagation();
					// Wenn offen...
					if ($rock.open) {
						methods.close($rock);
					}
					// Wenn geschlossen...
					else {
						methods.open($rock);
					}
				},
				// Bindet keyup an das handle zum öffnen mit 'pfeil unten' 
				keyup: function (e) {
					if (e.keyCode == 40) {
						// Springt auf die erste Option in der Liste
                        if(!$rock.open) {
                            methods.open($rock);
                        }
						// Öffnet rockdown, wenn noch nicht geschehen
						else {
						    $rock.element.find('li.option:first button').focus();    
                        }

					}
				}
			// Hängt handle ans rockdown ul
			})).appendTo(ul);
			
			// Liste für alle Optionen
			var ulul = $('<ul />', {
				'class': settings.optionsClass
			});
			// Für alle options und optgroups...
			$this.children('option:not(:selected),optgroup').each(function () {
				// Wenn es sich um einen Optgroup handelt...
				if ($(this).is('optgroup')) {
					// Ul der Optgroup
					ulul.append($('<li />', {
						'class': settings.optClass
					// Hängt nicht klickbares Label der Optgroup an
					}).append($('<span />', {
						text: $(this).attr('label')
					})));
					// ul für alle Options innerhalb der Optgroup
					var ululul = $('<ul />');
					$(this).children().each(function () {
						methods.buildLi(this).appendTo(ululul);
					});
					// Hängt ul mit allen Options der Optgroup in die li des Optgroup-Containers
					ulul.find('li.' + settings.optClass + ':last').append(ululul);
				}
				// Wenn es sich um eine einzelne Option handelt
				else {
					methods.buildLi(this).appendTo(ulul);
				}
			});
			// Hängt ul mit kompletter Liste aller Optionen und Optgroups in das rockdown ul
			ul.append($('<li />').append(ulul));
			// Wirft rockdown ul in $rock.element
			$rock.element = ul.delegate('li.option button', 'click.rock', function (e) {
				// Holt sich den Value des geklickten Elements
				$this.val($(e.target).data('val'));
				// Ändert Label auf gewählte Option
				ul.find('button.handle').text($(e.target).text()).attr('aria-valuetext', $(e.target).text());
				// Schließt das rockdown nach Auswahl
				methods.close($rock);
				// Feuert vom Dev gesetzten Callback ab
                settings.onChange.call($this);
			// Gleicher Button, anders Event: keyup
			}).delegate('li.option button', 'keydown', function (e) {
				// Holt alle in dem Rockdown verbauten Buttons zur späteren Verwendung
				var $buttons = $rock.element.find('button');
                // Bei Taste-nach-unten...
                if (e.keyCode === 40 || e.keyCode === 38) {
					e.preventDefault();			
					var scrollPos = ulul.scrollTop();
					console.log('before: ' + scrollPos);
					// Geht alle Buttons durch
					$buttons.each(function (index, value) {
						// Wenn wir uns auf dem Button befinden
						if (e.target === value) {
							if (e.keyCode === 40) {
								// Wenn aktueller Button nicht der letzte ist
								if (index + 1 < $buttons.length) {
									// Fokussiert den nächsten Button in der Liste
									e.preventDefault();
									$buttons.get(index + 1).focus();
								}							
							}
							else {
								// Wenn aktueller Button nicht der erste ist
								if (index - 1 > 0) {
									// Fokussiert den vorherigen Button in der Liste
									e.preventDefault();
									$buttons.get(index - 1).focus();
								}
							}							
						}
					});
					console.log('after: ' + scrollPos);
				}
			// Wirft rockdown hinter origin dropdown
			}).delegate('li.' + settings.optionClass, 'mouseover', function(){
				$(this).find('button').focus();
			}).insertAfter($this);
			// Übernimmt Änderungen am origin dropdown ins rockdown
			$this.bind('change', function () {
				$this = $(this);
				ul.find('button.handle').text($this.find('option[value=' + $this.val() + ']').text());
			});
		// Wirft das Ganze ins Stack
		rocks.push($rock); 
        });
	};
})(jQuery);