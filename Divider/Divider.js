/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @name gts.Divider
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
	name: "gts.Divider",
	classes: "gts-Divider",

	published: {
		/** @lends gts.Divider# */

		/**
		 * caption of bar
		 * @type string
		 * @default ""
		 */
		content: "",

		/**
		 * Should Divider use fittables? Set false if used in a list.
		 * @type boolean
		 * @default true
		 */
		useFittable: true
	},

	/**
	 * @protected
	 * @name gts.Divider#rendered
	 *
	 * Called by Enyo when UI is rendered.
	 */
	create: function() {

		this.inherited( arguments );

		this.useFittableChanged();
		this.contentChanged();
	},

	/**
	 * @protected
	 * @name gts.Divider#reflow
	 *
	 * Updates spacing on bar without resize event.
	 */
	reflow: function() {

		this.$['base'].reflow();
	},

	/**
	 * @protected
	 * @name gts.Divider#useFittableChanged
	 *
	 * Called by Enyo when this.useFittable is changed by host.
	 */
	useFittableChanged: function() {

		this.destroyComponents();

		this.createComponents(
				[
					{
						name: "base",
						kind: ( this.useFittable ? "enyo.FittableColumns" : "enyo.Control" ),
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
				], {
					owner: this
				}
			);
	},

	/**
	 * @protected
	 * @name gts.Divider#contentChanged
	 *
	 * Called by Enyo when this.content is changed by host.
	 * Updates UI for caption.
	 */
	contentChanged: function() {

		this.$['caption'].setContent( this.content );
		this.$['caption'].applyStyle( "display", this.content ? "" : "none" );

		this.reflow();
	}
});
