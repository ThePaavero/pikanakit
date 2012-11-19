/**
 * Timer SentenceTimer
 *
 * @package Pikanakit
 */

Pikanakit.Timers.SentenceTimer = function(element) {

	var self = this;

	self.started = null;
	self.ended   = null;

	/**
	 * Start the clock
	 * @return void
	 */
	this.start = function()
	{
		var now = new Date().getTime();

		$(element).data('sentenceTimer', now);
	};

	/**
	 * Stop the clock
	 * @return {integer} Milliseconds between stop and start
	 */
	this.stop = function()
	{
		var now = new Date().getTime();

		var started = $(element).data('sentenceTimer');
		var lag     = now - started;

		return lag;
	};

};

// EOF