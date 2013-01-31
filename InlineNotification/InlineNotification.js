/* Copyright © 2012, GlitchTech Science */

/**
 * @name gts.InlineNotification
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * Simple styler for in page notification text.
 *
 * @class
 * @version 2.0 (2012/07/17)
 * @see http://enyojs.com
 */
enyo.kind({
	name: "gts.InlineNotification",
	classes: "inline-notification",

	content: "",

	allowHtml: true,

	typeOptions: [
			"add",
			"error",
			"info",
			"search",
			"success",
			"success-blue",
			"warning"
		],

	published: {
		/** @lends gts.InlineNotification# */

		/**
		 * Choices for style.
		 * @see gts.InlineNotification#typeOptions
		 * @type string
		 * @default "error"
		 */
		type: "error",

		/**
		 * Display icon tag
		 * @type boolean
		 * @default true
		 */
		icon: true
	},

	/**
	 * @protected
	 * @function
	 * @name gts.InlineNotification#rendered
	 *
	 * Called by Enyo when UI is rendered.
	 */
	rendered: function() {

		this.inherited( arguments );

		this.typeChanged();
		this.iconChanged();
	},

	/**
	 * @private
	 * @function
	 * @name gts.InlineNotification#typeChanged
	 *
	 * Called by Enyo when this.type is changed by host.
	 * Updates UI
	 */
	typeChanged: function() {

		for( var i = 0; i < this.typeOptions.length; i++ ) {

			this.addRemoveClass( this.typeOptions[i], ( this.typeOptions[i] === this.type ) );
		}
	},

	/**
	 * @private
	 * @function
	 * @name gts.InlineNotification#iconChanged
	 *
	 * Called by Enyo when this.icon is changed by host.
	 * Updates UI
	 */
	iconChanged: function() {

		this.addRemoveClass( "no-image", !this.icon );
	}
});
