/**
 * Effect Sparkles
 *
 * @package Pikanakit
 */
Pikanakit.Effects.Sparkles = function(element, mood) {

	mood = mood || 'positive';

	if(element === undefined)
	{
		return false;
	}

	var amount_of_particles   = 3;
	var my_particle_elements  = [];
	var particle_minimum_size = 2;
	var particle_maximum_size = 6;

	for(var i = 0; i < amount_of_particles; i ++)
	{
		var sparkle = document.createElement('span');
			sparkle.className = 'pikanakit_effect_positive_sparkle_particle';

		var my_size  = Pikanakit.Helpers.randomFromInterval(particle_minimum_size, particle_maximum_size);
		var my_color = '#75ff91';
		var my_top   = (($(element).offset().top + $(element).outerHeight()) - my_size) + Pikanakit.Helpers.randomFromInterval(-5, 5);
		var my_left  = $(element).offset().left + Pikanakit.Helpers.randomFromInterval(-5, 5);

		$(sparkle).css({
			'position'         : 'absolute',
			'display'          : 'block',
			'width'            : my_size,
			'height'           : my_size,
			'border-radius'    : my_size,
			'background-color' : my_color,
			'top'              : my_top,
			'left'             : my_left,
			'box-shadow'       : '0px 0px 10px 0px #00ffb7'
		});

		my_particle_elements.push(sparkle);
		$('body').prepend(sparkle);

		$(sparkle).animate({
			'top'     : '+=30',
			'opacity' : 0
		}, 350);
	}

};

// EOF