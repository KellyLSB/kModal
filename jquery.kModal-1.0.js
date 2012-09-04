(function( $ ) {
	
	var settings;
	
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
			 * If the kModal instance is undefined set it to false
			 */
			if(window.kModalInstance === undefined)
				window.kModalInstance = false;

			/**
			 * If an instance already exists remove it
			 */
			if(window.kModalInstance !== false) {
				var tmp = $(this);

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
			$(this).kModal('resize');
			
			/**
			 * Add the kmodal class to the modal
			 */
			$(this).addClass('kmodal');
		
			/**
			 * Fade in the modal and the mask
			 */
			$('#kmodal_mask').fadeTo(settings['fade-time'], settings['mask-opacity']);
			$(this).fadeIn(settings['fade-time']);

			/**
			 * Start tracking window resizing and accomodate
			 */
			$(this).resize(function() {
				$(this).kModal('resize');
			});

			/**
			 * Add to the list of instances
			 */
			window.kModalInstance = $(this);
		},
		hide : function(callback, fademask) {

			/**
			 * Fade out the modal
			 */
			$(this).fadeOut(settings['fade-time']);

			/**
			 * Fade out the modal and the mask
			 */
			if(fademask === undefined || fademask === true)
				$('#kmodal_mask').fadeOut(settings['fade-time']);

			/**
			 * Unset the instace from the window
			 */
			window.kModalInstance = false;
			
		},
		resize : function(callback) {

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
			var modW = $(this).outerWidth();
			var modH = $(this).outerHeight();
			if(isNaN(modW)) modW = $(this).width();
			if(isNaN(modH)) modH = $(this).height();

			/**
			 * Calculate position the modal needs to be in
			 */
			var resize = {
				"top": Math.round((winH / 2) - (modH / 2)),
				"left": Math.round((winW / 2) - (modW / 2))
			};

			/**
			 * Set the height and width of the mask
			 */
			$('#kmodal_mask').css({
				'width': winW,
				'height': maskHeight,
			});

			/**
			 * Set the new values to the modal
			 */
			$(this).css('position', 'fixed');
			$(this).animate(resize, settings['fade-time']);
			$(this).css('z-index', settings['modal-z-index']);

			/**
			 * Return the position values
			 */
			return resize;
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