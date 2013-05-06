/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * gts.TimePicker
 * @extends onyx.TimePicker
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @param int	[minuteInterval]	Interval for minute picker
 */
enyo.kind({
	name: "gts.TimePicker",
	kind: "onyx.TimePicker",

	classes: "gts-timepicker",

	/** @public */
	published: {
		/** @lends gts.TimePicker# */

		/**
		 * Intervals between minute options
		 * @type int
		 * @default 5
		 */
		minuteInterval: 5,

		/**
		 * label of picker set
		 * @type string
		 * @default ""
		 */
		label: ""
	},

	/**
	 * @protected
	 * @extends onyx.TimePicker#initDefaults
	 */
	initDefaults: function() {

		this.createComponent(
				{
					name: "label",
					classes: "label"
				}, {
					owner: this
				}
			);

		this.inherited( arguments );

		this.minuteIntervalChanged();
		this.labelChanged();
	},

	/**
	 * @private
	 * @function
	 * @name gts.TimePicker#minuteIntervalChanged
	 *
	 * Called by Enyo when this.minuteInterval is changed by host.
	 * Updates options for minutePicker.
	 */
	minuteIntervalChanged: function() {

		this.$['minutePicker'].destroyClientControls();

		var min = Math.floor( this.value.getMinutes() / this.minuteInterval ) * this.minuteInterval;

		// create minutes
		for( var i = 0; i <= 59; i += this.minuteInterval ) {

			this.$['minutePicker'].createComponent( { content: ( i < 10 ) ? ( "0" + i ): i, value: i, active: i == min } );
		}
	},

	/**
	 * @private
	 * @function
	 * @name gts.TimePicker#labelChanged
	 *
	 * Called by Enyo when this.label is changed by host.
	 * Updates the label display.
	 */
	labelChanged: function() {

		this.$['label'].setContent( this.label );
	}
});
