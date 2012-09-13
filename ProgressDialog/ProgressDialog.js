/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * GTS.ProgressDialog
 *
 * Popup with icon, header text, sub text, and progress bar
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 * @requies Onyx (https://github.com/enyojs/onyx)
 */
enyo.kind({
	name: "GTS.ProgressDialog",
	kind: "onyx.Popup",

	classes: "gts-progress-dialog",

	/** @public */
	published: {
		/** @lends GTS.ProgressDialog# */

		/**
		 * Dialog title to display
		 * @type string
		 * @default ""
		 */
		title: "",

		/**
		 * Dialog message to display
		 * @type string
		 * @default ""
		 */
		message: "",

		/**
		 * Current position of progress bar
		 * @type number
		 * @default 0
		 */
		progress: "",

		/**
		 * CSS classes to apply to progress bar
		 * @type string
		 * @default ""
		 */
		progressBarClasses: "",

		/**
		 * If true, progress bar is 32px tall instead of standard 8px
		 * @type boolean
		 * @default false
		 */
		progressBarTall: false,

		/**
		 * Minimum progress value (i.e., no progress made)
		 * @type number
		 * @default 0
		 */
		min: 0,

		/**
		 * Maximum progress value (i.e., process complete)
		 * @type number
		 * @default 100
		 */
		max: 100,

		/**
		 * If true, stripes are shown in progress bar
		 * @type boolean
		 * @default false
		 */
		showStripes: false,

		/**
		 * If true (and showStripes is true), stripes shown in progress bar are animated
		 * @type boolean
		 * @default false
		 */
		animateStripes: false,

		/**
		 * If true, animates progress to the given value.
		 * @type boolean
		 * @default false
		 */
		animateProgress: false,

		/**
		 * Abort text. Set blank to not display
		 * @type string
		 * @default ""
		 */
		cancelText: "",

		/**
		 * Abort button class
		 * @type string
		 * @default "confirm"
		 */
		cancelClass: "onyx-negative",

		/**
		 * Set to true to automatically center the popup in the middle of the viewport.
		 * @type boolean
		 * @default true
		 * @see http://enyojs.com/api/#enyo.Popup::published
		 */
		centered: true,

		/**
		 * Set to true to render the popup in a floating layer outside of other controls. This can be used to guarantee that the popup will be shown on top of other controls.
		 * @type boolean
		 * @default true
		 * @see http://enyojs.com/api/#enyo.Popup::published
		 */
		floating: true,

		/**
		 * Set to true to prevent controls outside the popup from receiving events while the popup is showing.
		 * @type boolean
		 * @default true
		 * @see http://enyojs.com/api/#enyo.Popup::published
		 */
		modal: true,

		/**
		 * Determines whether or not to display a scrim. Only displays scrims when floating.
		 * @type boolean
		 * @default true
		 * @see http://enyojs.com/api/#enyo.Popup::published
		 */
		scrim: true,

		/**
		 * Class name to apply to the scrim. Be aware that the scrim is a singleton and you will be modifying the scrim instance used for other popups.
		 * @type string
		 * @default "onyx-scrim-translucent"
		 * @see http://enyojs.com/api/#enyo.Popup::published
		 */
		scrimclasses: "onyx-scrim-translucent",

		/**
		 * By default, the popup will hide when the user taps outside it or presses ESC. Set to false to prevent this behavior.
		 * @type boolean
		 * @default false
		 * @see http://enyojs.com/api/#enyo.Popup::published
		 */
		autoDismiss: false
	},

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends GTS.Gapi# */

		/**
		 * Cancel button pressed
		 * @event
		 * @param {Object} inSender	Event's sender
		 * @param {Object} inEvent	{}
		 */
		onCancel: ""
	},

	components: [
		{
			name: "title",
			classes: "title-wrapper"
		},
		{
			name: "message",
			classes: "message-wrapper"
		}, {
			name: "progressBar",
			kind: "onyx.ProgressBar"
		}, {
			classes: "button-wrapper",
			components: [
				{
					name: "cancelButton",
					kind: "onyx.Button",

					ontap: "cancel",
					showing: false
				}
			]
		}
	],

	/**
	 * @protected
	 * @function
	 * @name GTS.ConfirmDialog#rendered
	 *
	 * Called by Enyo when UI is rendered.
	 */
	rendered: function() {

		this.inherited( arguments );

		this.baseButtonClasses = this.$['cancelButton'].getClassAttribute();

		this.titleChanged();
		this.messageChanged();

		this.progressChanged();
		this.progressBarClassesChanged();
		this.progressBarTallChanged();
		this.minChanged();
		this.maxChanged();
		this.showStripesChanged();
		this.animateStripesChanged();

		this.cancelTextChanged();
		this.cancelClassChanged();
	},

	/**
	 * @public
	 * @function
	 * @name GTS.ConfirmDialog#show
	 *
	 * Shows the progress dialog. Attempts to mix in arguments with published values after display.
	 *
	 * @param {}	published	published variables to update
	 */
	show: function( published ) {

		this.inherited( arguments );

		for( property in published ) {

			var funct = "set" + property.charAt( 0 ).toUpperCase() + property.slice( 1 );

			if( enyo.isFunction( this[funct] ) ) {

				this[funct]( published[property] );
			}
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#titleChanged
	 *
	 * Called by Enyo when this.title is changed by host.
	 */
	titleChanged: function() {

		this.$['title'].setContent( this.title );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#messageChanged
	 *
	 * Called by Enyo when this.message is changed by host.
	 */
	messageChanged: function() {

		this.$['message'].setContent( this.message );

		if( this.message.length === 0 ) {

			this.$['message'].hide();
		} else {

			this.$['message'].show();
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#progressChanged
	 *
	 * Called by Enyo when this.progress is changed by host.
	 * Adjusts progress bar progress
	 */
	progressChanged: function() {

		if( this.animateProgress ) {

			this.$['progressBar'].animateProgressTo( this.progress );
		} else {

			this.$['progressBar'].setProgress( this.progress );
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#progressBarClassesChanged
	 *
	 * Called by Enyo when this.progressBarClasses is changed by host.
	 */
	progressBarClassesChanged: function() {

		this.$['progressBar'].setBarClasses( this.progressBarClasses );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#progressBarClassesChanged
	 *
	 * Called by Enyo when this.progressBarTall is changed by host.
	 */
	progressBarTallChanged: function() {

		this.$['progressBar'].addRemoveClass( "tall", this.progressBarTall );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#progressBarClassesChanged
	 *
	 * Called by Enyo when this.min is changed by host.
	 */
	minChanged: function() {

		this.$['progressBar'].setMin( this.min );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#progressBarClassesChanged
	 *
	 * Called by Enyo when this.max is changed by host.
	 */
	maxChanged: function() {

		this.$['progressBar'].setMax( this.max );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#progressBarClassesChanged
	 *
	 * Called by Enyo when this.showStripes is changed by host.
	 */
	showStripesChanged: function() {

		this.$['progressBar'].setShowStripes( this.showStripes );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#animateStripesChanged
	 *
	 * Called by Enyo when this.animateStripes is changed by host.
	 */
	animateStripesChanged: function() {

		this.$['progressBar'].setAnimateStripes( this.animateStripes );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#cancelTextChanged
	 *
	 * Called by Enyo when this.cancelText is changed by host.
	 */
	cancelTextChanged: function() {

		this.$['cancelButton'].setContent( this.cancelText );

		if( this.cancelText.length === 0 ) {

			this.$['cancelButton'].hide();
		} else {

			this.$['cancelButton'].show();
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#cancelClassChanged
	 *
	 * Called by Enyo when this.confirmText is changed by host.
	 */
	cancelClassChanged: function() {

		this.$['cancelButton'].setClassAttribute( this.baseButtonClasses + " " + this.cancelClass );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#cancel
	 *
	 * Cancel button tapped. Hides dialog and notifies host.
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	cancel: function( inSender, inEvent ) {

		this.doCancel( inEvent );
		this.hide();
	}
});
