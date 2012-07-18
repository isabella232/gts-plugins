/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * GTS.TimePicker
 *
 * Time picker for EnyoJS.
 * When the selected date changes, the onChange event is called with the current values as a date object.
 * Using getValue or setValue will get or set the datetime with a Date object.
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 * @requies Onyx (https://github.com/enyojs/onyx)
 *
 * @param {date}	[dateObj]	Initial date object set; defaults to current date
 */
enyo.kind({
	name: "GTS.TimePicker",

	classes: "gts-timepicker",

	/** @public */
	published: {
		value: null,

		timeFormat: "12"//12 or 24
	},

	events: {
		onChange: ""
	},

	/** @private */
	components: [
		{
			kind: "onyx.PickerDecorator",
			components: [
				{
					kind: "onyx.Button"
				}, {
					name: "hoursPicker",
					kind: "onyx.FlyweightPicker",
					count: 12,
					onSetupItem: "setupHours",
					components: [
						{
							name: "hours"
						}
					]
				}
			]
		}, {
			kind: "onyx.PickerDecorator",
			components: [
				{
					kind: "onyx.Button"
				}, {
					name: "minutesPicker",
					kind: "onyx.FlyweightPicker",
					count: 60,
					onSetupItem: "setupMinutes",
					components: [
						{
							name: "minutes"
						}
					]
				}
			]
		}, {
			name: "segmentstWrapper",
			kind: "onyx.PickerDecorator",
			components: [
				{
					kind: "onyx.Button"
				}, {
					name: "segmentsPicker",
					kind: "onyx.FlyweightPicker",
					count: 2,
					onSetupItem: "setupSegments",
					components: [
						{
							name: "segments"
						}
					]
				}
			]
		}
	],

	/** @protected */
	rendered: function() {

		this.inherited( arguments );

		this.timeFormatChanged();
	},

	/** @protected */
	timeFormatChanged: function() {

		if( this.timeFormat == "12" ) {

			//am pm
			this.$['segmentstWrapper'].show();
			this.$['hoursPicker'].setCount( 12 );
		} else {

			//24 hour
			this.$['segmentstWrapper'].hide();
			this.$['hoursPicker'].setCount( 24 );
		}

		this.valueChanged();
	},

	/** @protected */
	valueChanged: function() {

		if( Object.prototype.toString.call( this.value ) !== "[object Date]" || isNaN( this.value.getTime() ) ) {
			//Not actually a date object

			this.value = new Date();
		}

		if( this.timeFormat == "12" ) {
		} else {
		}
	},

	setupHours: function( inSender, inEvent ) {

		this.$['hours'].setContent( inEvent.index );
	},

	setupMinutes: function( inSender, inEvent ) {

		this.$['minutes'].setContent( inEvent.index );
	},

	setupSegments: function( inSender, inEvent ) {

		this.$['segments'].setContent( inEvent.index );
	}
});
