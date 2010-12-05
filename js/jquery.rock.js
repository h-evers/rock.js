// jquery plugin
(function ($) {
	$.fn.rocks = function (options) {
		var enter = '';
        var settings = {
			optionClass: 'option',
			optionsClass: 'options',
			optClass: 'opt',
            openClass: 'open',
			onChange: function () {}
		};
        var timeout = [];
		// Stack, in dem alle Dropdowns liegen
        var rocks = [];
		// Private Methoden
		var methods = {
			// Baut Listenpunkte (options) zusammen
			buildButton: function($element){
                return $('<button />', {
					text: $element.text()
				}).data('val', $element.val());
            },

            buildLi: function (element) {
				var $element = $(element);
                return $('<li />', {
					'class': settings.optionClass,
					'role': 'option'
				}).append(methods.buildButton($element));
			},

			// Schließt einzelnes Rockdown
			close: function ($rock) {
				$rock.element.removeClass(settings.openClass);
                $rock.open = false;
				$(document).unbind('click.rock').unbind('keyup.rock');
			},
			// Schließt alle Rockdowns und öffnet das übergebene
			open: function ($rock) {
                $(document).unbind('click.rock').unbind('keyup.rock');
                $.each(rocks,function(){
                   this.element.removeClass(settings.openClass);
                   this.open = false;
                });

                $rock.element.addClass(settings.openClass);
                $rock.open = true;
				// Einmaliges, delegiertes Event zum schließen bei click in document oder esc
                $(document).bind({
					'click.rock': function () {
						methods.close($rock);
					},
					'keyup.rock': function (e) {
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
                return (jQuery);
            }

			
			// $rock enthält Element ($this) und Zustand (z.B. open)
			// Hat noch Platz für mehr ;-)
			var $rock = {'buttons':[]};
			// Baut rockdown-ul auf, hängt noch nicht im DOM
			var ul = $('<ul />', {
				'class': 'rockdown'
			});
            $rock.handleText = $this.find('option:selected').text();
			// Baut handle zusammen (der Teil, der im geschlossenen Zustand zu sehen ist);
			$('<li />').append($('<button />', {
				text: $rock.handleText,
				'class': 'handle',
				'aria-valuetext': $rock.handleText
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
				'keyup.rock': function (e) {
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
            $rock.buttons = ulul.find('li.'+settings.optionClass+' button');
			// Hängt ul mit kompletter Liste aller Optionen und Optgroups in das rockdown ul
			ul.append($('<li />').append(ulul));
			// Wirft rockdown ul in $rock.element
			$rock.element = ul.delegate('li.option button', 'click.rock', function (e) {
				// Holt sich den Value des geklickten Elements
                var $target = $(e.target);
                $this.val($(e.target).data('val'));
				// Ändert Label auf gewählte Option
				ul.find('button.handle').text($target.text()).attr('aria-valuetext', $target.text());
				// Schließt das rockdown nach Auswahl
				methods.close($rock);
				// Feuert vom Dev gesetzten Callback ab
                settings.onChange.call($this);
			// Gleicher Button, anders Event: keyup
			}).delegate('li.option button,.handle', 'keydown.rock', function (e) {
                // Holt alle in dem Rockdown verbauten Buttons zur späteren Verwendung
				
             
                if(e.keyCode>=49 && e.keyCode<=90){
                    e.preventDefault();

                    //clear all timeouts
                    $.each(timeout,function(){
                        window.clearTimeout(this);
                    });
                    var id = window.setTimeout(function(){
                        enter = '';
                    }, 2500);

                    timeout.push(id);
                    enter = enter+String.fromCharCode(e.keyCode);
                    $rock.buttons.each(function(index,value){
                        //found!
                        if($(this).text().toLowerCase().indexOf(enter.toLowerCase()) === 0){
                                $(this).hover().focus();
                                return false;
                        }
                        // nothing found
                        if(index===$rock.buttons.length-1){
                            enter = '';
                        }
                    });

                }

                // Bei Taste-nach-unten...
                if (e.keyCode === 40 || e.keyCode === 38) {
					e.preventDefault();
					// Geht alle Buttons durch
					$rock.buttons.each(function (index, value) {
						// Wenn wir uns auf dem Button befinden
						if (e.target === value) {
							if (e.keyCode === 40) {
								// Wenn aktueller Button nicht der letzte ist
								if (index + 1 < $rock.buttons.length) {
									// Fokussiert den nächsten Button in der Liste
									e.preventDefault();
									$rock.buttons.get(index + 1).focus();
								}							
							}
							else {
								// Wenn aktueller Button nicht der erste ist
								if (index > 0) {
									// Fokussiert den vorherigen Button in der Liste
									e.preventDefault();
									$rock.buttons.get(index-1).focus();
								}
							}							
						}
					});
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