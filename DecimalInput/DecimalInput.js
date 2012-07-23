/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * GTS.DecimalInput
 *
 * Input specifically for decimal or other decimal number formats.
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 * @extends Input
 *
 * @param {date}	[dateObj]	Initial date object set; defaults to current date
 */
enyo.kind({
	name: "GTS.DecimalInput",
	kind: "Input",

	classes: "decimal-input",

	oldValue: "",

/*
  Numberic input with decimal: $<input type="number" name="currency" min="0" max="9999" ="0.01" size="4"
    title="CDA Currency Format - no dollar sign and no comma(s) - cents (.##) are optional" />
    <br />* setting step="0.01" is the only way to enforce decimal on an input field of type="number" (note: 1-precision decimal place (.1) will be allowed). Non-numeric values are automatically discarded on the input field's change event.
*/

	/** @public */
	published: {
		/** @lends GTS.DecimalInput# */

		/**
		 * Input type. This should be number unless issues with browser occur.
		 * @type string
		 * @default "number"
		 */
		type: "number",

		/**
		 * Hint text for input
		 * @type string
		 * @default "0.00"
		 */
		placeholder: "0.00",

		/**
		 * Minimum numerical value for the input
		 * @type number
		 * @default 0
		 */
		min: 0,

		/**
		 * Maximum numerical value for the input. False for no limit
		 * @type number|boolean
		 * @default false
		 */
		max: false,


		/**
		 * Number of decimal points to format to. (equiv of toFixed)
		 * Adjusts the step option.
		 * @type integer
		 * @default 2
		 */
		precision: 2,

		/**
		 * ATM Mode. Auto formats the number as if one is typing on an atm keypad.
		 * Relies on precision.
		 * @type boolean
		 * @default false
		 */
		atm: false
	},

	/**
	 * @private
	 * List of events to handle
	 */
	handlers: {
		onkeypress: "filterInput",
		oninput: "inputValueUpdated",
		onchange: "inputValueChanged",
		onfocus: "",
		onblur: ""
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.DecimalInput#rendered
	 *
	 * Called by Enyo when UI is rendered.
	 */
	rendered: function() {

		this.inherited( arguments );

		this.minChanged();
		this.maxChanged();
		this.precisionChanged();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DecimalInput#minChanged
	 *
	 * Called by Enyo when this.min is changed by host.
	 */
	minChanged: function() {

		this.setAttribute( "min", this.min );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DecimalInput#maxChanged
	 *
	 * Called by Enyo when this.max is changed by host.
	 */
	maxChanged: function() {

		if( this.max !== false ) {

			this.setAttribute( "max", this.max );
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DecimalInput#precisionChanged
	 *
	 * Called by Enyo when this.precision is changed by host.
	 */
	precisionChanged: function() {

		var step = "0.";

		if( this.precision <= 0 ) {

			step = "1";
		} else {

			for( var i = 0; i < this.precision - 1; i++ ) {

				step += "0";
			}

			step += "1";
		}

		this.setAttribute( "step", step );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DecimalInput#filterInput
	 *
	 * Backup for the HTML5 type=number filter.
	 * Restricts allowed characters to 0-9 and decimal point.
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	filterInput: function( inSender, inEvent ) {

		if( !( inEvent.keyCode >= 48 && inEvent.keyCode <= 57 ) && inEvent.keyCode !== 46 ) {

			inEvent.preventDefault();
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DecimalInput#inputValueUpdated
	 *
	 * Handles input being typed in.
	 * If this.atm is true, will format number
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	inputValueUpdated: function( inSender, inEvent ) {

		this.log( arguments, this.getValueAsNumber() );

		if( this.atm ) {

			this.error();
			return;

			var amount = this.getValueAsNumber();

			var oldamount = inSender.oldValue;

			//Save cursor position
			var curPos = this.$['amount'].getSelection();//https://developer.mozilla.org/en/DOM/HTMLTextAreaElement

			if( !amount || amount.length <= 0 ) {

				curPos['start'] = 4;
				curPos['end'] = 4;
			} else if( ( oldamount.length - 1 ) === amount.length ) {
				//Char deleted

				curPos['start']++;
				curPos['end']++;
			}

			//Format number
			if( amount == "" || amount == 0 ) {

				amount = "0.00";
			} else {

				amount = amount.replace( /[^0-9]/g, "" );
				amount = amount.replace( /^0*/, "" );

				amount = ( parseInt( amount ) / 100 ).toFixed( 2 );
			}

			//Update values
			inSender.oldValue = amount;
			inSender.setValue( amount );

			//Restore cursor position
			inSender.setSelection( curPos );//Ignoring command when string length < 4
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DecimalInput#inputValueChanged
	 *
	 * Handles input onChange event. Backup validation for max and min.
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	inputValueChanged: function( inSender, inEvent ) {

		var amount = this.getValueAsNumber();

		if( this.max !== false && amount > this.max ) {

			amount = this.max;
		} else if( amount < this.min ) {

			amount = this.min;
		}

		this.setValue( amount );
	},

	/**
	 * @public
	 * @function
	 * @name GTS.DecimalInput#getValueAsNumber
	 *
	 * Returns the current value as a number. If NaN, returns zero.
	 *
	 * @return number
	 */
	getValueAsNumber: function() {

		//Strip out non-numeric characters and trim the string
		var val = this.getValue().replace( /^\s\s*/, "" ).replace( /\s\s*$/, "" ).replace( /[^0-9\.]/g, "" );

		//Convert to a float
		val = parseFloat( val, 10 ).toFixed( this.precision );

		//Confirm it is a number
		if( isNaN( val ) ) {

			val = 0;
		}

		return val;
	}
});
