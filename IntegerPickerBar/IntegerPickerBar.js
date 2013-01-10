/*
Copyright ©, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @name GTS.IntegerPickerBar
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * Integer Picker that takes up an entire row. Does not look like a giant button.
 *
 * @class
 * @version 2.0
 * @requires onyx
 * @requires GTS.IntegerPicker
 * @see http://enyojs.com
 */
enyo.kind({
	name: "GTS.IntegerPickerBar",
	kind: "onyx.Item",

	classes: "gts-integerPickerBar",

	published: {
		/** @lends GTS.IntegerPickerBar# */

		/**
		 * label of drop down
		 * @type string
		 * @default "Pick a value"
		 */
		label: "Pick a value",

		/**
		 * Note about dropdown, sits under it
		 * @type string
		 * @default ""
		 */
		sublabel: "",

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
		 * Currently selected item in drop down
		 * @type string,int
		 * @default ""
		 */
		value: "",

		/**
		 * Is user input disabled?
		 * @type boolean
		 * @default false
		 */
		disabled: false,

		/**
		 * Max height of picker popup (px)
		 * @type string
		 * @default 200
		 */
		maxHeight: 200,

		/**
		 * Width of picker button, null for natural
		 * @type string
		 * @default null
		 */
		pickerWidth: null
	},

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends GTS.IntegerPickerBar# */

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
	 * @type Array
	 * Components of the control
	 */
	components: [
		{
			name: "base",
			kind: "enyo.FittableColumns",
			components: [
				{
					name: "label",
					fit: true
				}, {
					kind: "onyx.PickerDecorator",
					components: [
						{
							name: "pickerButton",
							classes: "arrow"
						}, {
							name: "integer",
							kind: "GTS.IntegerPicker",

							min: 1,
							max: 25,

							classes: "gts-IntegerPickerBar",

							onChange: "selectionChanged"
						}
					]
				}
			]
		}, {
			name: "sublabel",
			classes: "sub-label"
		}
	],

	/**
	 * @protected
	 * @function
	 * @name GTS.IntegerPickerBar#rendered
	 *
	 * Called by Enyo when UI is rendered.
	 */
	rendered: function() {

		this.inherited( arguments );

		this.labelChanged();
		this.sublabelChanged();

		this.minChanged();
		this.maxChanged();
		this.stepChanged();
		this.valueChanged();

		this.disabledChanged();

		this.pickerWidthChanged();
		this.maxHeightChanged();

		enyo.asyncMethod( this, this.reflow );
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.IntegerPickerBar#reflow
	 *
	 * Updates spacing on bar without resize event.
	 */
	reflow: function() {

		enyo.asyncMethod(
				this,
				this.waterfallDown,
				"onresize",
				"onresize",
				this
			);
	},

	/**
	 * @private
	 * @function
	 * @name GTS.IntegerPickerBar#labelChanged
	 *
	 * Called by Enyo when this.label is changed by host.
	 * Updates the label display.
	 */
	labelChanged: function() {

		this.$['label'].setContent( this.label );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.IntegerPickerBar#sublabelChanged
	 *
	 * Called by Enyo when this.sublabel is changed by host.
	 * Updates the sublabel display.
	 */
	sublabelChanged: function() {

		this.$['sublabel'].setContent( this.sublabel );

		if( this.sublabel === "" ) {

			this.$['sublabel'].hide();
		} else {

			this.$['sublabel'].show();
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.IntegerPickerBar#disabledChanged
	 *
	 * Called by Enyo when this.disabled is changed by host.
	 * Disables button when this.disabled is true
	 */
	disabledChanged: function() {

		this.$['pickerButton'].setDisabled( this.disabled );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.IntegerPickerBar#maxHeightChanged
	 *
	 * Called by Enyo when this.maxHeight is changed by host.
	 */
	maxHeightChanged: function() {

		this.$['integer'].setMaxHeight( this.maxHeight );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.IntegerPickerBar#pickerWidthChanged
	 *
	 * Called by Enyo when this.pickerWidth is changed by host.
	 */
	pickerWidthChanged: function() {

		this.$['pickerButton'].applyStyle( "width", this.pickerWidth );
	},

	/**
	 * @private
	 * @name GTS.IntegerPicker#minChanged
	 *
	 * Called by Enyo when this.min is changed by host.
	 * Updates menu choices; Calls UI updater.
	 */
	minChanged: function() {

		this.$['integer'].setMin( this.getMin() );
	},

	/**
	 * @private
	 * @name GTS.IntegerPicker#maxChanged
	 *
	 * Called by Enyo when this.max is changed by host.
	 * Updates menu choices; Calls UI updater.
	 */
	maxChanged: function() {

		this.$['integer'].setMax( this.getMax() );
	},

	/**
	 * @private
	 * @name GTS.IntegerPicker#stepChanged
	 *
	 * Called by Enyo when this.step is changed by host.
	 * Updates menu choices; Calls UI updater.
	 */
	stepChanged: function() {

		this.$['integer'].setStep( this.getStep() );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.IntegerPickerBar#valueChanged
	 *
	 * Updates UI
	 */
	valueChanged: function() {

		this.$['integer'].setValue( this.getValue() );
		this.$['pickerButton'].setContent( this.getValue() );

		this.reflow();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.IntegerPickerBar#selectionChanged
	 *
	 * Handles menu selection; Calls host function for onChange
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	selectionChanged: function( inSender, inEvent ) {

		this.value = this.$['integer'].getValue();
		this.$['pickerButton'].setContent( this.getValue() );
		this.reflow();

		this.doChange( enyo.mixin( inEvent, { "value": this.getValue() } ) );

		return true;
	}
});
