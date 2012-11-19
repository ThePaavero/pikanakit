/**
 * Pikanakit game - Main application object
 * @package Pikanakit
 */
Pikanakit.App = function() {

	/*global $, console, Pikanakit, randomFromInterval */
	'use strict';

	var self = this;

	var failed_sentences = [];
	var running = false;

	/**
	 * Initiate
	 * @param  {object} element HTML element to attach game to
	 * @return void
	 */
	this.init = function(element, sentence_set)
	{
		sentence_set = sentence_set || 'DefaultSet';

		// *ding ding ding* (tä)
		running = true;

		self.game_element = element;

		// Pace of the game (delay between sentences)
		self.sentence_pace = 9000;

		// How many sentences can the player fail before a game over?
		self.allowed_fails = 5;

		// Starting points
		self.points = 0;

		// Set a ceiling for how fast we get to throw sentences at the player
		self.minimum_delay_between_sentences = 1000;

		// How much faster will the next sentece show up (per "turn")?
		self.speed_up_per_sentence = 200;

		// Remove any possible "loading..." crap
		$(self.game_element).html('');

		// Load our level data;
		self.sentence_object = Pikanakit.Sentences[sentence_set];

		// Gather and randomize the order of our sentences
		self.sentences = shuffle(self.sentence_object.data);

		// Boot shit
		createSentencePool();
		createPrompt();
		createPointsCounter();
		createFailCounter();
		listenToPrompt();
		glueFocusToPrompt();

		// Listen to a start game
		doSplashScreen();
	};

	this.GetGameElement = function()
	{
		return self.game_element;
	};

	// -----------------------------------------------------------------------

	var doSplashScreen = function()
	{
		// Create the splash screen element inside the sentence pool area
		$('#pikanakit_sentence_pool').html('<div id="pikanakit_splash">Hit <strong>enter</strong> when you\'re ready!</div>');

		// Bind some keystrokes (and unbind them after they're run)
		$(document).bind('keydown.splash', function(e)
		{
			if(e.keyCode === 13) // Enter
			{
				$('#pikanakit_splash').remove();
				var msg = new Pikanakit.Effects.FlashMessage('GO!', '#75ff91', self.game_element);
				queSentences();
				$(document).unbind('.splash');

				return false;
			}
		});
	};

	/**
	 * Create our input field that works as the prompt
	 * @return void
	 */
	var createPrompt = function()
	{
		var p = document.createElement('input');
			p.type = 'text';
			p.id   = 'pikanakit_prompt';

		$(self.game_element).append(p);

		self.prompt = p;

		$(p).focus();
	};

	/**
	 * Create an HTML element that shows how many times the player's fucked up
	 * @return void
	 */
	var createFailCounter = function()
	{
		$(self.game_element).append('<div id="fail_counter_wrapper">Fucked up sentences: <span id="fail_counter">0</span> / ' + self.allowed_fails + '</div>');
	};

	var createPointsCounter = function()
	{
		$(self.game_element).append('<div id="points_counter_wrapper">Points: <span id="points_counter">0</span></div>');
	};

	/**
	 * Listen to changes in our prompt element
	 * @return void
	 */
	var listenToPrompt = function()
	{
		$(self.prompt).keyup(function()
		{
			updateFromPrompt();
		});
	};

	/**
	 * Make any click on the entire game area focus on the prompt element
	 * @return void
	 */
	var glueFocusToPrompt = function()
	{
		$(self.game_element).click(function()
		{
			$(self.prompt).focus();
		});
	};


	/**
	 * Create our sentence pool element
	 * @return void
	 */
	var createSentencePool = function()
	{
		var e = document.createElement('div');
			e.id = 'pikanakit_sentence_pool';

		self.pool = e;

		$(self.game_element).append(e);
	};

	/**
	 * Gather our sentences
	 * @return void
	 */
	var queSentences = function()
	{
		self.sentence_pointer = 0;
		throwSentence();
	};

	/**
	 * Get the current sentence from our sentence array
	 * @return {string}
	 */
	var getCurrentSentence = function()
	{
		return self.sentences[self.sentence_pointer];
	};

	var getCurrentSentenceElement = function()
	{
		return $('.sentence')[0]; // This is fucked up
	};

	/**
	 * Throw a new sentence at player
	 * TODO: This is way too big, break it up
	 *
	 * @return void
	 */
	var throwSentence = function()
	{
		if(self.sentence_timer)
		{
			clearTimeout(self.sentence_timer);
		}

		// If we have an older sentence, it means the player has failed
		// to get it right. Bad.
		if($('.sentence').length > 0)
		{
			createFail($('.sentence')[0]);
			setTimeout(resetPrompt, 200); // Slight delay... TODO?

			// If this is the nth fail, it might mean a game over
			if(failed_sentences.length > self.allowed_fails)
			{
				// Yup, sorry
				gameOver();
				return false;
			}
		}

		// Moving on...
		self.sentence_pointer ++;

		// Make the player's life a bit harder
		self.sentence_pace -= self.speed_up_per_sentence;

		// Emergency brake... this player must be awesome
		if(self.sentence_pace < self.minimum_delay_between_sentences)
		{
			self.sentence_pace = self.minimum_delay_between_sentences;
		}

		// Add the currently active sentence into the DOM
		var sentence = getCurrentSentence();

		if(sentence === undefined)
		{
			// Shit, we're out of sentences!
			levelDone();
			return false;
		}

		// Create the DOM element for our sentence...

		// Wrap each character in a span element for styling purposes
		var chars = sentence.split('');
		for(var i in chars)
		{
			chars[i] = '<span>' + chars[i] + '</span>';
		}
		var html_version_of_sentence = chars.join(''); // Back to a string

		var sentence_element = document.createElement('div');
			sentence_element.innerHTML = html_version_of_sentence;
			sentence_element.className = 'sentence';
			sentence_element.id        = 'sentence_' + self.sentence_pointer;

		$(sentence_element).data('id', self.sentence_pointer);

		// Put it into the DOM
		$(self.pool).append(sentence_element);

		// Obscure the sentence markup so that it can't be easily copy+pasted
		obscureSentenceMarkup(sentence_element);

		// Other methods will be interested in the plaintext sentence!
		$(sentence_element).data('string', sentence);

		// Some visual effects...
		$(sentence_element).hide();
		$(sentence_element).fadeIn(650);

		// If the game isn't "running", don't continue calling ourselves
		if(running !== true)
		{
			return false;
		}

		// Count a suitable time for this sentence (depending on its length)
		var sentence_time = self.sentence_pace + (sentence.length * 100);

		// Draw the annoying timer thing
		if(self.paintingTimer)
		{
			clearInterval(self.paintingTimer);
		}
		paintTimingSpansForSentenceElement($('#sentence_' + self.sentence_pointer), sentence_time);

		// Start the clock!
		sentence_element.timer = new Pikanakit.Timers.SentenceTimer(sentence_element);
		sentence_element.timer.start();

		// Do all of this again after a given delay
		self.sentence_timer = setTimeout(function()
		{
			throwSentence();

		}, sentence_time);
	};

	/**
	 * Inject shit in between the span elements in a sentence in order to
	 * garble any attempted copy+paste cheats.
	 * @param  {object} element Sentence HTML element
	 * @return void
	 */
	var obscureSentenceMarkup = function(element)
	{
		var character = randomFromInterval(50, 350);

		var old_markup = $(element).html();
		var new_markup = old_markup.replace(/<\/span><span>/g, '</span><div class="obsc">' + character + '</div><span>');
		$(element).html(new_markup);
	};

	/**
	 * Do a boo-boo for the player (failed to type out a sentence)
	 * @param  {object} Sentence element DOM element
	 * @return void
	 */
	var createFail = function(element)
	{
		failed_sentences.push(element);
		$(element).remove();

		updateFails();

		// Show the player she fucked up
		$(self.game_element).addClass('fucked_up');
		setTimeout(function()
		{
			$(self.game_element).removeClass('fucked_up');

		}, 150);
	};

	/**
	 * Update the fails we're showing
	 * @return void
	 */
	var updateFails = function()
	{
		$('#fail_counter').html(failed_sentences.length);
	};

	/**
	 * Add points and update the indicator
	 * @param  {integer} add Points to add
	 * @return void
	 */
	var modifyPoints = function(add)
	{
		self.points += add;
		updatePoints();
	};

	/**
	 * Update player's points
	 * @return void
	 */
	var updatePoints = function()
	{
		$('#points_counter').html(self.points);
	};

	/**
	 * Player typed the whole sentence, move on to the next one!
	 * @return void
	 */
	var currentSentenceCleared = function()
	{
		var my_element = getCurrentSentenceElement();
		var sentence   = getCurrentSentence();
		var time       = my_element.timer.stop();

		var bonus = evaluateSentenceCompletedTime(time, sentence.length);

		// Apply the bonus
		modifyPoints(bonus);

		var word = 'Nice!'; // Default

		console.log(bonus);

		if(bonus > 230)
		{
			word = 'HOLY FUCK';
		}
		else if(bonus > 180)
		{
			word = 'Quick as hell!';
		}
		else if(bonus > 140)
		{
			word = 'Quick!';
		}
		else if(bonus > 120)
		{
			word = 'Nice, dude';
		}
		else if(bonus > 100)
		{
			word = 'Good!';
		}
		else if(bonus > 80)
		{
			word = 'Get with it!';
		}
		else
		{
			word = 'Oh come on!!';
		}

		var effect = new Pikanakit.Effects.FlashMessage(word + ': +' + bonus, '#75ff91', self.game_element);

		resetPrompt();
		blowSentenceUp('success', self.sentence_pointer);
		throwSentence();
	};

	/**
	 * Count a suitable bonus by comparing how fast the player completed
	 * the sentence and how long that sentence was.
	 * @param  {integer} time   Milliseconds
	 * @param  {integer} length Character count of sentence
	 * @return {integer}        Bonus amount
	 */
	var evaluateSentenceCompletedTime = function(time, length)
	{
		var bonus = 0;

		var time_per_character = Math.round(time / length);
		var mean = 300;

		if(time_per_character <= mean)
		{
			bonus = mean - time_per_character;
		}

		return bonus;
	};

	/**
	 * When we want to dispose of a shown sentence
	 * @param  {string} mood i.e. 'success'
	 * @param  {string} id   A number, use as part of a selector
	 * @return void
	 */
	var blowSentenceUp = function(mood, id)
	{
		var element = $('#sentence_' + id);

		$(element).addClass('blow_up ' + mood);

		var current_top  = $(element).offset().top;
		var current_left = $(element).offset().left;

		var ghost = document.createElement('div');
			ghost.innerHTML = $(element).html();

		$(ghost).addClass('sentence_ghost ' + mood);

		$(self.game_element).prepend(ghost);

		$(ghost).css({
			position : 'absolute',
			width: $(element).outerWidth(),
			display  : 'block',
			top      : current_top,
			left     : current_left
		});

		$(ghost).animate({
			'margin-top': -400,
			'opacity': 0
		}, 500);

		$(element).remove();
	};

	/**
	 * React to changes in our prompt element -- check how we're doing
	 * @return void
	 */
	var updateFromPrompt = function()
	{
		var typed                = $(self.prompt).val();
		var cursor_at            = typed.length;
		var goal_string          = getCurrentSentence();
		var points_for_character = 10; // TODO
		var points_for_word      = 5; // Per character
		var points_for_sentence  = 100; // TODO
		var effect;

		if(goal_string === undefined)
		{
			return false;
		}

		// Is this correct?
		var correct_so_far = goal_string.indexOf(typed) === 0;

		var good_chars = cursor_at;
		var current_sentence_element = $('#sentence_' + self.sentence_pointer);

		// Get the last character (span element) of this sentence
		var last_span = $(current_sentence_element).find('span')[good_chars-1];
		var next_span = $(current_sentence_element).find('span')[good_chars];

		// Show to what extent the player is in the clear
		if(correct_so_far === true)
		{
			// "Paint" how many characters of the given sentence?
			paintGoodCharsForElement(current_sentence_element, good_chars);

			// Decorate it with a positive sparkle effect!
			effect = new Pikanakit.Effects.Sparkles(last_span, 'positive');

			// Add and show points
			self.points += points_for_character;

			// Was this the end of a word?
			if($(next_span).html() === ' ')
			{
				// Yup, nice
				self.points += (points_for_word);
				effect = new Pikanakit.Effects.CompletedWord(last_span);
			}

			updatePoints();
		}
		else
		{
			// The player's fucking up
			effect = new Pikanakit.Effects.FaultyStroke(current_sentence_element);
		}

		// Are we done with the sentence?
		if(correct_so_far && cursor_at === goal_string.length)
		{
			// Yup, well done. Move on
			currentSentenceCleared();

			// Give some extra credit for a completed sentence
			self.points += points_for_sentence;
			updatePoints();

			// Show it!
			effect = new Pikanakit.Effects.CompletedSentence(self.game_element);
		}
	};

	/**
	 * Do that annoying "keep up" animation
	 * @param  {object} el    DOM element
	 * @param  {integer} time Delay between each sentence
	 * @return void
	 */
	var paintTimingSpansForSentenceElement = function(el, time)
	{
		var our_string = $(el).data('string');

		// How fast do we need to paint each span in order to exactly fill
		// out the time the player has for the sentence?
		var our_interval = time / our_string.length;
		var span_counter = 0;

		self.paintingTimer = setInterval(function()
		{
			// Get our spans
			var span = $(el).find('span')[span_counter];
			$(span).addClass('timer_painted_span');

			span_counter ++;

		}, our_interval);
	};

	/**
	 * Vibisly mark how the player's doing typing out the current sentence
	 * @param  {pbject}  el     DOM element
	 * @param  {integer} amount Number of characters that are correct
	 * @return void
	 */
	var paintGoodCharsForElement = function(el, amount)
	{
		$(el).find('span').removeClass('good_character');

		var counter = 0;

		$(el).find('span').each(function()
		{
			if(counter >= amount)
			{
				return false;
			}

			// This is a "good" span
			$(this).addClass('good_character');

			counter ++;
		});
	};

	/**
	 * Clear the prompt element
	 * @return void
	 */
	var resetPrompt = function()
	{
		$(self.prompt).val('');
	};

	/**
	 * Sentences are used up, this should be a good thing for the player
	 * @return void
	 */
	var levelDone = function()
	{
		clearTimeout(self.sentence_timer);
		running = false;

		// How did we do?
		// TODO...
	};

	/**
	 * That's all, folks
	 * @return void
	 */
	var gameOver = function()
	{
		running = false;
		clearTimeout(self.sentence_timer);
		clearInterval(self.paintingTimer);
		$('.sentence').remove();

		$('#pikanakit_prompt, #fail_counter_wrapper').fadeOut(650, function()
		{
			$('#points_counter_wrapper').css({
				'font-size' : 100
			});
		});
	};

	/**
	 * Shuffle an array (as PHP does with its shuffle() function)
	 * @param  {array} o
	 * @return {array} o, but with shuffled order
	 */
	var shuffle = function(o)
	{
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i, 10), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};

}; // End Pikanakit.App

// EOF