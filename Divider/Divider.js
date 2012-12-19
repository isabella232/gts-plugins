/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @name GTS.Divider
 * @author Matthew Schott <glitchtechscience@gmail.com>

 * @param string	[content]	Divider text
 *
 * @class
 * @version 2.1 (2012/10/29)
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 * @requies Onyx (https://github.com/enyojs/onyx)
 * @requies Layout/Fittable (https://github.com/enyojs/layout)
 * @see http://enyojs.com
 */
enyo.kind({
	name: "GTS.Divider",
	classes: "gts-Divider",

	published: {
		/** @lends GTS.Divider# */

		/**
		 * caption of bar
		 * @type string
		 * @default ""
		 */
		content: ""
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
			noStretch: true,

			classes: "base-bar",

			components: [
				{
					classes: "end-cap bar"
				}, {
					name: "caption",
					classes: "caption"
				}, {
					classes: "bar full",
					fit: true
				}
			]
		}
	],

	/**
	 * @protected
	 * @function
	 * @name GTS.Divider#rendered
	 *
	 * Called by Enyo when UI is rendered.
	 */
	rendered: function() {

		this.inherited( arguments );

		this.contentChanged();
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.Divider#reflow
	 *
	 * Updates spacing on bar without resize event.
	 */
	reflow: function() {

		this.$['base'].reflow();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.Divider#captionChanged
	 *
	 * Called by Enyo when this.open is changed by host.
	 * Updates UI for caption.
	 */
	contentChanged: function() {

		this.$['caption'].setContent( this.content );
		this.$['caption'].applyStyle( "display", this.content ? "" : "none" );

		this.reflow();
	}
});
