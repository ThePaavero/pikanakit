/**
 * "Main"
 *
 * @package Pikanakit
 */
 (function() {

	/*global Pikanakit, LazyLoad, $*/
	'use strict';

	var files = [

			'js/game/namespaces.js',
			'js/game/game.js',

			'js/game/helpers/randomfrominterval.js',

			'js/game/timers/sentencetimer.js',

			'js/game/effects/flashmessage.js',
			'js/game/effects/sparkles.js',
			'js/game/effects/faultystroke.js',
			'js/game/effects/completedsentence.js',
			'js/game/effects/completedword.js',

			'js/game/sentences/set1.js',
			'js/game/sentences/set2.js'

		];

	LazyLoad.js(files, function()
	{
		// Assign a default content set
		var content_set = 'EnglishProverbs';

		// Sniff for a set segment in our URL
		if(window.location.href.indexOf('#/set/') > -1)
		{
			// Grab it
			var segment = window.location.href.split('#/set/')[1];

			// Check to see if we have a sentence object with this name
			if(Pikanakit.Sentences[segment] !== undefined)
			{
				// Yup, assign it instead of the default
				content_set = segment;
			}
		}

		// Go!
		var app = new Pikanakit.App();
			app.init($('#game'), content_set);
	});

})();

// EOF