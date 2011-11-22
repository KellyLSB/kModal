(function( $ ) {
	
	var settings;
	
	var methods = {
		init : function(options) {
			
			settings = $.extend( {
				'mask-color': '#000',
				'mask-opacity': 0.3,
				'mask-z-index': 10,
				'attachment':'center', // @todo
				'close-esc':1,
				'close-mask':1,
				'close-button':0,
				'bind-link':1,
				'fade-time':500
			} , options);
			
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
			
			if(settings['bind-link']) {
				$('a[kmodal=1]').live('click', function(e) {
					e.preventDefault();
					var id = $(this).attr('href');

					methods.show(id);
				});
			}
			
			if(settings['close-button']) {
				$('.kmodal .close').click(function(e) {
					e.preventDefault();
					$('.kmodal').each(function() {
						$(this).kModal('hide');
					});
				});
			}

			if(settings['close-mask']) {
				$('#kmodal_mask').click(function(e) {
					e.preventDefault();
					$('.kmodal').each(function() {
						$(this).kModal('hide');
					});
				});
			}

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
			
			var maskHeight = $(document).height();
			var maskWidth = $(window).width();

			$('#kmodal_mask').css({
				'width': maskWidth,
				'height': maskHeight,
			});
			
			$(this).kModal('resize');
			
			$(this).addClass('kmodal');
		
			$('#kmodal_mask').fadeTo(settings['fade-time'], 0.66);
			$(this).fadeIn(settings['fade-time']);			
		},
		hide : function(callback) {
			$('#kmodal_mask').fadeOut(settings['fade-time']);
			$(this).fadeOut(settings['fade-time']);
		},
		resize : function(callback) {
			var winH = $(window).height();
			var winW = $(window).width();
			
			$(this).css('position', 'absolute');
			$(this).animate({'top': winH / 2 - $(this).height() / 2}, settings['fade-time']);
			$(this).animate({'left': winW / 2 - $(this).width() / 2}, settings['fade-time']);
			$(this).css('z-index', 11);
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
