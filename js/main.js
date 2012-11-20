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
		var app = new Pikanakit.App();
			app.init($('#game'), 'EnglishProverbs');
	});

})();

// EOF