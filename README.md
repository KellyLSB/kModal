kModal Kustom Modal
===================
kModal originally came up because we needed a modal that did not copy the div contents requiring us to rebind links. We since have developed it further to support custom styles. It was very important to us that we did not interfere with your modal style desires.

How to use kModal
=================
To get started with kModal just include these lines into the bottom of your html file (or inside a `$(document).ready()` event)

	<script src="/path/to/scripts/kModal.js" type="text/javascript"></script>
	<script type="text/javascript">
	$(document).kModal('init' [, options]);
	</script>

This will append all the needed kModal elements, and set their default styles. After you can use these functions to manipulate your modals.

	$(_element-id_).kModal('show'); // Opens the modal
	$(_element-id_).kModal('hide'); // Closes the modal
	$(_element-id_).kModal('resize'); // Repositions the modal (if you resize the modal for any reason you need to call this)

Caputuring the element resize event automatically
-------------------------------------------------
For some odd reason jQuery has restricted the .resize() event to only be available on the window. So to make kModal automatically detect the resize event you need to include Ben Alman's [jQuery resize event plugin](http://benalman.com/projects/jquery-resize-plugin/).

Setting Options
===============
When intializing kModal with `$(document).kModal('init' [, options]);` you can pass the following options as a JSON object.

	{
		'mask-color': '#000', // Color of the mask
		'mask-opacity': 0.3, // Opacity of the mask
		'mask-z-index': 10, // Z-Index of the mask
		'close-esc':1, // Bind the ESC key to close the modal
		'close-mask':1, // Bind clicking on the mask to close the modal
		'close-button':0, // Bind any immediate child of the modal that has the 'close' class to close the modal
		'bind-link':1, // Bind any link containing the attribute kmodal="1" to open the modal whose selector matches that of the href attribute
		'fade-time':500, // How long does it take to fade in / out
		'modal-z-index': 11 // Modal Z-Index level
	}

License
=======
kModal by Kelly Lauren Summer Becker is licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License.
Permissions beyond the scope of this license may be available at http://kellybecker.me.

[<img src="http://i.creativecommons.org/l/by-sa/3.0/88x31.png" alt="BY-SA" title="BY-SA">](http://creativecommons.org/licenses/by-sa/3.0/)