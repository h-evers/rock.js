// jquery plugin
(function ($) {
	$.fn.rock_fast = function (options) {
		var enter = '';
        html = [];
        var settings = {
			optionClass: 'option',
			optionsClass: 'options',
			optClass: 'opt',
            openClass: 'open',
            mobileClass: 'rjsmo',
            timeout: 1000,
			onChange: function () {}
		};
        var timeout = [];
		// Stack, in dem alle Dropdowns liegen
        var rocks = [];
		// Private Methoden
		var methods = {
			// Baut Listenpunkte (options) zusammen
			

            buildLi: function (element) {

                var $element = $(element);
                return '<li role="option" data-value="'+$element.attr('value')+'" class="'+settings.optionClass+'"><button>'+$element.text()+'</button></li>';
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
			// Speichert aktuelles jQuery-Objekt in $this
			var $this = $(this);

            // Steigt aus, ob es sich überhaupt um ein select handelt
			// Kann später als Elementweiche benutzt werden
			// Object dürfte dadurch nicht mehr chainable sein
            if(!$this.is('select')){
                return (jQuery);
            }
            if(navigator.userAgent.toLowerCase().match(/(iphone|android)/)) {
                $('body').addClass(settings.mobileClass);
                return (jQuery);
            }

            // Überschreibt options falls angegeben
            if (options) {
				$.extend(settings, options);
			}
            // hide the select
            //$this.hide();

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
				var $this = $(this);
                if ($this.is('optgroup')) {
					// Ul der Optgroup
					html.push('<li class="'+settings.optClass+'"><span>'+$this.attr('label')+'</span><ul>');
                    /*ulul.append($('<li />', {
						'class': settings.optClass
					// Hängt nicht klickbares Label der Optgroup an
					}).append($('<span />', {
						text: $(this).attr('label')
					})));*/
					// ul für alle Options innerhalb der Optgroup

                    var ululul = $('<ul />');
					$(this).children().each(function () {
						html.push(methods.buildLi(this));
					});
                    html.push('</ul></li>');
					// Hängt ul mit allen Options der Optgroup in die li des Optgroup-Containers
					//ulul.find('li.' + settings.optClass + ':last').append(ululul);
				}
				// Wenn es sich um eine einzelne Option handelt
				else {
					html.push(methods.buildLi(this));
				}
			});
            ulul.append(html.join(''));
            $rock.buttons = ulul.find('li.'+settings.optionClass+' button');
			// Hängt ul mit kompletter Liste aller Optionen und Optgroups in das rockdown ul
			ul.append($('<li />').append(ulul));
			// Wirft rockdown ul in $rock.element
			$rock.element = ul.delegate('li.option button', 'click.rock', function (e) {
				// Holt sich den Value des geklickten Elements
                var $target = $(e.target);

                console.log($target.parent().attr('data-value'));
                $this.val($target.parent().attr('data-value'));
				// Ändert Label auf gewählte Option
				ul.find('button.handle').text($target.text()).attr('aria-valuetext', $target.text());
				// Schließt das rockdown nach Auswahl
				methods.close($rock);
				// Feuert vom Dev gesetzten Callback ab
                settings.onChange.call($this);
			// Gleicher Button, anders Event: keyup
			}).delegate('li.option button,.handle', 'keydown.rock', function (e) {
                // Holt alle in dem Rockdown verbauten Buttons zur späteren Verwendung







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
                //clear all timeouts
                    $.each(timeout,function(){
                        window.clearTimeout(this);
                    });
                    var id = window.setTimeout(function(){
                       enter = '';
                    }, settings.timeout);

                    timeout.push(id);
                    enter = enter+String.fromCharCode(e.keyCode);
                    $rock.buttons.each(function(index,value){
                        var $this = $(this);
                        $rock.$last = $this;
                        if($this.text().toLowerCase().indexOf(enter.toLowerCase()) === 0){

								if(!$rock.open) {

									$this.trigger('click.rock');
								}
                                else {
                                        $this.hover().focus();
                                }

                        }
                        // nothing found

                    });
			// Wirft rockdown hinter origin dropdown
			}).delegate('li.' + settings.optionClass, 'mouseover', function(){
				$(this).find('button').focus();
			}).insertAfter($this);
			// Übernimmt Änderungen am origin dropdown ins rockdown
			$this.bind('change', function () {
				$this = $(this);
				ul.find('button.handle').text($this.find('option[value=' + $this.val() + ']').first().text());
			});
		// Wirft das Ganze ins Stack
		rocks.push($rock);

        });
	};
})(jQuery);