/**
 * Effect CompletedWord
 *
 * @package Pikanakit
 */
Pikanakit.Effects.CompletedWord = function(element) {

	/*global Pikanakit, $*/
	'use strict';

	if(element === undefined)
	{
		return false;
	}

	/**
	 * Sparkle shit
	 *
	 */
	var amount_of_particles   = 4;
	var my_particle_elements  = [];
	var particle_minimum_size = 10;
	var particle_maximum_size = 20;

	for(var i = 0; i < amount_of_particles; i ++)
	{
		var sparkle = document.createElement('span');
			sparkle.className = 'pikanakit_effect_positive_sparkle_particle';

		var my_size  = Pikanakit.Helpers.randomFromInterval(particle_minimum_size, particle_maximum_size);
		var my_color = '#00e5ff';
		var my_top   = (($(element).offset().top + $(element).outerHeight()) - my_size) + Pikanakit.Helpers.randomFromInterval(-5, 5);
		var my_left  = $(element).offset().left + Pikanakit.Helpers.randomFromInterval(-35, 1);

		$(sparkle).css({
			'position'         : 'absolute',
			'display'          : 'block',
			'width'            : my_size,
			'height'           : my_size,
			'border-radius'    : my_size,
			'background-color' : my_color,
			'top'              : my_top,
			'left'             : my_left,
			'box-shadow'       : '0px 0px 5px 0px #00a6ff'
		});

		my_particle_elements.push(sparkle);
		$('body').prepend(sparkle);

		$(sparkle).animate({
			'top'     : '+=30',
			'opacity' : 0
		}, 350);
	}

	/**
	 * Flash the whole sentence a little
	 *
	 */
	var sentence_element = $(element).parent();
	$(sentence_element).addClass('sentence_when_completed_word');
	setTimeout(function()
	{
		$(sentence_element).removeClass('sentence_when_completed_word');
	}, 150);

};

// EOF