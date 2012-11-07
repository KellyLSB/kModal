(function( $ ) {
	
	var settings;
	var scrollPosition;
	var binds;
	
	var methods = {
		init : function(options) {
			
			/**
			 * Set the default settings
			 */
			settings = $.extend( {
				'mask-color': '#000',
				'mask-opacity': 0.3,
				'mask-z-index': 10,
				'attachment':'center', // @todo
				'close-esc':1,
				'close-mask':1,
				'close-button':0,
				'bind-link':1,
				'fade-time':500,
				'modal-z-index': 11,
				'fixed-top': false
			} , options);
			
			/**
			 * Insert the modal mask and set it's css
			 */			
			$('<div id="kmodal_mask"></div>').appendTo('body');

			$('#kmodal_mask').css({
				'background': settings['mask-color'],
				'position': 'fixed',
				'top': 0,
				'left': 0,
				'right': 0,
				'bottom': 0,
				'z-index': settings['mask-z-index'],
				'display': 'none'
		    });
			
			/**
			 * Do we want to bind to links
			 */
			if(settings['bind-link']) {
				$('a[kmodal=1]').live('click', function(e) {
					e.preventDefault();
					var id = $(this).attr('href');

					$(id).kModal('show');
				});
			}
			
			/**
			 * If a close button exists on the model then close when it is clicked
			 */
			if(settings['close-button']) {
				$('.close').click(function(e) {
					e.preventDefault();
					$('.kmodal').each(function() {
						$(this).kModal('hide');
					});
				});
			}

			/**
			 * If we want to close the modal when the mask is clicked
			 */
			if(settings['close-mask']) {
				$('#kmodal_mask').click(function(e) {
					e.preventDefault();
					$('.kmodal').each(function() {
						$(this).kModal('hide');
					});
				});
			}

			/**
			 * If we want the ESC key to close the modal bind it
			 */
			if(settings['close-esc']) {
				$(document).keyup(function(e) {
					e.preventDefault();
					if (e.keyCode == 27) {
						$('.kmodal').each(function() {
							$(this).kModal('hide');
						});
					}
				});
			}
		},
		show : function(callback) {

			/**
			 * Get modal object
			 */
			var $modal = $(this);

			/**
			 * If the kModal instance is undefined set it to false
			 */
			if(window.kModalInstance === undefined)
				window.kModalInstance = false;

			/**
			 * If an instance already exists remove it
			 */
			if(window.kModalInstance !== false) {
				var tmp = $modal;

				/**
				 * Fade out the existing instance and fade in the new one
				 */
				window.kModalInstance.kModal('hide', function() {
					return tmp.kModal('show');	
				}, false);	
			}

			/**
			 * Resize the modal and position it
			 */
			$modal.kModal('resize');
			
			/**
			 * Add the kmodal class to the modal
			 */
			$modal.addClass('kmodal');

			/**
			 * Get scroll position
			 */
			var scrollPosition = function(d) {
				if(settings['fixed-top'] !== false) {
					scrollPosition = [0,0];
					$(window).scrollTo(0,0);
				}

				else scrollPosition = [
					self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
					self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
				];
			};

			/**
			 * Fade in Modal
			 */
			var fadeInModal = function(d) {
				
				/**
			 	 * Fade in the modal and the mask
			 	 */
				$('#kmodal_mask').fadeTo(settings['fade-time'], settings['mask-opacity']);
				$modal.fadeIn(settings['fade-time']);

				/**
			 	 * Start tracking window resizing and accomodate
			 	 */
				$modal.resize(function() {
					$modal.kModal('resize');
				});
			};

			$.defercall(scrollPosition, fadeInModal).done(function() {

				// Lock the scroll poisition
				var html = jQuery('html');
				html.data('scroll-position', scrollPosition);
				html.data('previous-overflow', html.css('overflow'));
				html.css('overflow', 'hidden');

				// Hack for browsers
				if(settings['fixed-top'] === false)
					$(window).scrollTo(scrollPosition[0], scrollPosition[1]);
			});

			/**
			 * Add to the list of instances
			 */
			window.kModalInstance = $modal;

			// Run callbacks
			for(var i in binds[$modal]['show']) {
				callback = binds[$modal]['show'][i];
				callback($modal);
			}
		},
		hide : function(callback, fademask) {

			var $modal = $(this);

			/**
			 * Fade out the modal
			 */
			$modal.fadeOut(settings['fade-time']);

			/**
			 * Unlock scroll position
			 */
			var html = jQuery('html');
			var scrollPosition = html.data('scroll-position');
			html.css('overflow', html.data('previous-overflow'));
			window.scrollTo(scrollPosition[0], scrollPosition[1])

			/**
			 * Fade out the modal and the mask
			 */
			if(fademask === undefined || fademask === true)
				$('#kmodal_mask').fadeOut(settings['fade-time']);

			/**
			 * Unset the instace from the window
			 */
			window.kModalInstance = false;

			// Run callbacks
			for(var i in binds[$modal]['hide']) {
				callback = binds[$modal]['hide'][i];
				callback($modal);
			}
			
		},
		resize : function(callback) {

			var $modal = $(this);

			/**
			 * Get the document height for the mask
			 */
			var maskHeight = $(document).outerHeight();

			/**
			 * Get window size
			 */
			var winW = $(window).outerWidth();
			var winH = $(window).outerHeight();
			if(isNaN(winW)) winW = $(window).width();
			if(isNaN(winH)) winH = $(window).height();

			/**
			 * Get modal size
			 */
			var modW = $modal.outerWidth();
			var modH = $modal.outerHeight();
			if(isNaN(modW)) modW = $modal.width();
			if(isNaN(modH)) modH = $modal.height();

			/**
			 * Calculate position the modal needs to be in
			 */
			var resize = {
				"top": Math.round((winH / 2) - (modH / 2)),
				"left": Math.round((winW / 2) - (modW / 2))
			};

			// Create a deferend
			var defer = $.defercall(function(deferend) {

				// If we need to resize and position the modal
				if($modal.attr('kmodal-resize') == 'false')
					return false;

				// Determine the fixation for the modal
				if(settings['fixed-top'] !== false) {
					resize.top = settings['fixed-top'];
					$modal.css('position', 'absolute');
				}
				else $modal.css('position', 'fixed');
			});

			// If the deferend passes run
			defer.then(function() {

				// Animating the resizing of the modal
				$modal.animate(resize, settings['fade-time']);
			});

			// Always Run
			defer.always(function() {

				// Set the height and width of the mask
				$('#kmodal_mask').css({
					'width': winW,
					'height': maskHeight,
				});

				// Apply the Z-Index to the modal
				$modal.css('z-index', settings['modal-z-index']);
			});

			// Run callbacks
			for(var i in binds[$modal]['resize']) {
				callback = binds[$modal]['resize'][i];
				callback($modal);
			}

			/**
			 * Return the position values
			 */
			return resize;
		},
		bind : function(type, callback) {

			$modal = this;

			// If undefined create an object
			if(binds == undefined)
				binds = new Object;
			if(binds[$modal] == undefined)
				binds[$modal] = new Object;
			if(binds[$modal][type] == undefined)
				binds[$modal][type] = new Array;

			// Append the call back to an array
			if($.isFunction(callback))
				binds[$modal][type].push(callback);

			// Return true
			return true;
		}
	}
	
	$.fn.kModal = function( method ) {
		
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.kModal' );
		}
		
  };
})( jQuery );