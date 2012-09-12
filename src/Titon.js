/**
 * Titon: The Mootools UI/Utility Framework
 *
 * @copyright	Copyright 2010+, Titon
 * @link		http://github.com/titon
 * @license		http://opensource.org/licenses/bsd-license.php (BSD License)
 */

/**
 * The base object for all Titon classes. Contains global functionality and configuration.
 *
 * @version	0.3
 *
 * @changelog
 * 	v0.3
 * 		Added blackout support
 * 		Added callback support to fadeOut()
 */
var Titon = {

	/**
	 * Current version.
	 */
	version: '0.3',

	/**
	 * Options for all classes.
	 *
	 *	prefix 			- (string) String to prepend to all created element containers
	 *	activeClass		- (string) Class name to append to active elements
	 *	disabledClass	- (string) Class name to append to disabled elements
	 *	draggingClass	- (string) Class name to append to elements being dragged
	 */
	options: {
		prefix: 'titon-',
		activeClass: 'active',
		disabledClass: 'disabled',
		draggingClass: 'dragging'
	},

	/**
	 * Localization messages.
	 */
	msg: {
		loading: 'Loading...'
	},

	/**
	 * The blackout element.
	 */
	blackout: null,

	/**
	 * The count of how many methods are calling blackouts.
	 */
	blackoutCount: 0,

	/**
	 * Converts a value to a specific scalar type.
	 * The value is extracted via parseOptions().
	 *
	 * @param {string} value
	 * @return {boolean|string|number}
	 */
	convertType: function(value) {
		if (value === 'true') {
			value = true;

		} else if (value === 'false') {
			value = false;

		} else if (value === 'null') {
			value = null;

		} else if (isNaN(value)) {
			value = String.from(value);

		} else {
			value = Number.from(value);
		}

		return value;
	},

	/**
	 * Hide the blackout if the counter reaches 0.
	 */
	hideBlackout: function() {
		if (Titon.blackoutCount) {
			Titon.blackoutCount--;

			if (Titon.blackoutCount <= 0) {
				Titon.blackout.hide();
			}
		}
	},

	/**
	 * Merge custom options into the base. Clone the base as to not reference the original.
	 *
	 * @param {object} base
	 * @param {object} options
	 * @return {object}
	 */
	mergeOptions: function(base, options) {
		return Object.merge(Object.clone(base || {}), options || {});
	},

	/**
	 * Parse options out of the data-options attributes.
	 * Format: key1:value1;key2:value2
	 *
	 * @param {object} data
	 * @return {object}
	 */
	parseOptions: function(data) {
		var options = {};

		if (data) {
			data.split(';').each(function(item) {
				var pieces = item.split(':');

				if (pieces.length) {
					options[pieces[0]] = Titon.convertType(pieces[1]);
				}
			});
		}

		return options;
	},

	/**
	 * Show the blackout and increase the counter.
	 */
	showBlackout: function() {
		if (!Titon.blackout) {
			Titon.blackout = new Element('div.' + Titon.options.prefix + 'blackout', {
				id: 'titon-blackout'
			});
		}

		Titon.blackout.show();
		Titon.blackoutCount++;
	},

	/**
	 * Apply custom options.
	 *
	 * @param {object} options
	 */
	setup: function(options) {
		Titon.options = Object.merge(Titon.options, options);
	}

};

/**
 * Prototype overrides.
 */
Element.implement({

	/**
	 * Returns an object representation of the data-options attribute located on the element.
	 *
	 * @param {string} scope
	 * @return {object}
	 */
	getOptions: function(scope) {
		return Titon.parseOptions(this.get('data-' + scope + '-options'));
	},

	/**
	 * Show an element using its default display type, or pass a forced type.
	 *
	 * @param {string} force
	 * @return {Element}
	 */
	show: function(force) {
		return this.setStyle('display', force || '');
	},

	/**
	 * Hide an element.
	 * @return {Element}
	 */
	hide: function() {
		return this.setStyle('display', 'none');
	},

	/**
	 * Fade in an element and set its display type.
	 *
	 * @param {int} duration
	 * @return {Element}
	 */
	fadeIn: function(duration) {
		duration = duration || 600;

		return this.setStyles({
			display: '',
			opacity: 0
		}).set('tween', {
			duration: duration,
			link: 'cancel'
		}).fade('in');
	},

	/**
	 * Fade out an element and remove from DOM.
	 *
	 * @param {int} duration
	 * @param {function} callback
	 * @return {Element}
	 */
	fadeOut: function(duration, callback) {
		duration = duration || 600;

		if (typeOf(callback) === 'null') {
			callback = function() {
				this.element.dispose();
			};
		}

		this.set('tween', {
			duration: duration,
			link: 'cancel'
		}).fade('out');

		if (callback) {
			this.get('tween').chain(callback);
		}

		return this;
	}

});

String.implement({

	/**
	 * Remove specific characters from a string.
	 *
	 * @param {string|array} chars
	 * @return {String}
	 */
	remove: function(chars) {
		if (typeOf(chars) !== 'array') {
			chars = chars.toString().split('');
		}

		return this.replace(new RegExp('[' + chars.join('|') + ']+', 'ig'), '');
	}

});