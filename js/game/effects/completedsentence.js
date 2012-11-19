/**
 * Effect CompletedSentence
 *
 * @package Pikanakit
 */
Pikanakit.Effects.CompletedSentence = function(element) {

	$(element).addClass('arena_when_completed_sentence');
	setTimeout(function()
	{
		$(element).removeClass('arena_when_completed_sentence');
	}, 150);
};

// EOF