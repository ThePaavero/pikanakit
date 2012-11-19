/**
 * Effect FlashMessage
 *
 * @package Pikanakit
 */
Pikanakit.Effects.FlashMessage = function(msg, color_hex, append_to) {

	append_to = append_to || $('body');
	color_hex = color_hex || '#75ff91';

	var e = document.createElement('div');
		e.innerHTML = msg;
		e.className = 'flash_message';
		e.id        = 'pikanakit_flash_message';

	$(e).css({
		'position'    : 'absolute',
		'margin-top'  : ($(append_to).height() / 2) - ($(e).height() / 2),
		'margin-left' : ($(append_to).width() / 2) - ($(e).width() / 2),
		'color'       : color_hex
	});

	$(append_to).prepend(e);

	$(e).animate({
		'font-size'   : 100,
		'opacity'     : 0,
		'margin-top'  : ($(append_to).height() / 2) - $(e).height(),
		'margin-left' : ($(append_to).width() / 2) - ($(e).width() / 2) - $(e).width()
	}, 1200, 'easeOutQuart');
};

// EOF