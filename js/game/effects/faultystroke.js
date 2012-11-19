/**
 * Effect FaultyStroke
 *
 * @package Pikanakit
 */
Pikanakit.Effects.FaultyStroke = function(element) {

	if(element === undefined)
	{
		return false;
	}

	var x = document.createElement('div');
		x.innerHTML = '⊘';

	var my_size = 1000;

	$(x).css({
		'font-size' : my_size,
		'position'  : 'fixed',
		'color'     : '#db0058',
		'top'       : (my_size / 3) * -1,
		'left'      : ($(window).width() / 2) - (my_size / 2)
	});

	$('body').prepend(x);

	$(x).fadeOut(150, function()
	{
		$(this).remove();
	});
};

// EOF