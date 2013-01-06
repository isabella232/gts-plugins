/* Copyright © 2011-2012, GlitchTech Science */

/**
 * @name GTS.integerPicker
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * Extends the Onyx Picker to auto populate min through max in steps.
 *
 * @class
 * @version 2.0 (2012/07/12)
 * @requires onyx 2.0-beta5
 * @extends onyx.Picker
 * @see http://enyojs.com
 */
enyo.kind({
	name: "GTS.IntegerPicker",
	kind: "onyx.Picker",

	classes: "gts-integer-picker",

	published: {
		/** @lends GTS.IntegerPicker# */

		/**
		 * Min picker value
		 * @type int
		 * @default 1
		 */
		min: 1,

		/**
		 * Max picker value
		 * @type int
		 * @default 100
		 */
		max: 10,

		/**
		 * Picker steps
		 * @type int
		 * @default 1
		 */
		step: 1,

		/**
		 * Picker value
		 * @type int
		 * @default min
		 */
		value: null
	},

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends GTS.IntegerPicker# */

		/**
		 * Selected item changed
		 * @event
		 * @param {Object} inSender	Event's sender
		 * @param {Object} inEvent	Event parameters
		 */
		onChange: ""
	},

	/**
	 * @private
	 * List of events to handle
	 */
	handlers: {
		onSelect: "selectionChanged"
	},

	/**
	 * @private
	 * @name GTS.IntegerPicker#create
	 *
	 * Calls UI updater.
	 */
	create: function() {

		this.inherited( arguments );

		this.generateValues();
	},

	/**
	 * @private
	 * @name GTS.IntegerPicker#minChanged
	 *
	 * Called by Enyo when this.min is changed by host.
	 * Updates menu choices; Calls UI updater.
	 */
	minChanged: function() {

		this.generateValues();
	},

	/**
	 * @private
	 * @name GTS.IntegerPicker#maxChanged
	 *
	 * Called by Enyo when this.max is changed by host.
	 * Updates menu choices; Calls UI updater.
	 */
	maxChanged: function() {

		this.generateValues();
	},

	/**
	 * @private
	 * @name GTS.IntegerPicker#stepChanged
	 *
	 * Called by Enyo when this.step is changed by host.
	 * Updates menu choices; Calls UI updater.
	 */
	stepChanged: function() {

		this.generateValues();
	},

	/**
	 * @private
	 * @name GTS.IntegerPicker#generateValues
	 *
	 * Updates UI
	 */
	generateValues: function() {

		this.destroyClientControls();

		if( this.value == null || isNaN( this.value ) ) {

			this.value = this.min;
		}

		var items = [];

		for( var i = this.min; i <= this.max; ) {

			items.push( { "content": i, active: ( i == this.value ) } );

			i += this.step;
		}

		this.createComponents( items, { owner: this } );
		this.render();
	},

	/**
	 * @private
	 * @name GTS.IntegerPicker#selectionChanged
	 *
	 * Handles pciker selection; Calls host function for onChange
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	selectionChanged: function( inSender, inEvent ) {

		this.setValue( inEvent.selected.content );

		this.doChange( { "originator": inEvent, "value": this.value } );
	}
});
