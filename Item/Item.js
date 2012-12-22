/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * GTS.Item
 *
 * Row item for use in lists and repeaters. Enables tap display on row.
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 * @requies Onyx (https://github.com/enyojs/onyx)
 */
enyo.kind( {
	name: "GTS.Item",
	kind: "onyx.Item",

	classes: "gts-item",

	/** @public */
	published: {
		/** @lends GTS.Item# */

		/**
		 * Add class onyx-hightlight to row on hold
		 * @type boolean
		 * @default false
		 */
		tapHighlight: false,

		/**
		 * Add class gts-pulse to row on tap
		 * @type boolean
		 * @default true
		 */
		tapPulse: true,

		/**
		 * Class name to add on tap
		 * @type string
		 * @default "gts-pulse"
		 */
		tapClass: "gts-pulse",

		/**
		 * Class name to add on hold
		 * @type string
		 * @default "onyx-highlight"
		 */
		highlightClass: "onyx-highlight"
	},

	/** @protected */
	preventTapDisplayTimer: 0,

	/** @protected */
	handlers: {
		ontap: "startTap",
		onhold: "hold",
		onrelease: "release"
	},

	/**
	 * @public
	 * @name GTS.Item#startTap
	 *
	 * Called on tap. Adds class to row.
	 */
	startTap: function( inSender, inEvent ) {

		if( this.tapPulse ) {

			if( this.preventTapDisplayTimer >= ( ( new Date() ).getTime() - 50 ) ) {
				//prevent tap event display from occurring just after a hold event

				return;
			}

			onyx.Item.addFlyweightClass( ( this.controlParent || this ), this.tapClass, inEvent );

			enyo.job( "endTap", enyo.bind( this, this.endTap, inSender, inEvent ), 250 );
		}
	},

	/**
	 * @protected
	 * @name GTS.Item#endTap
	 *
	 * Removes class from row.
	 */
	endTap: function( inSender, inEvent ) {

		if( this.tapPulse ) {

			onyx.Item.removeFlyweightClass( ( this.controlParent || this ), this.tapClass, inEvent );
		}
	},

	/**
	 * @public
	 * @name GTS.Item#hold
	 *
	 * Called on hold. Adds class to row. Removes tap class.
	 */
	hold: function( inSender, inEvent ) {

		if( this.tapHighlight ) {

			onyx.Item.addFlyweightClass( ( this.controlParent || this ), this.highlightClass, inEvent );
		}
	},

	/**
	 * @public
	 * @name GTS.Item#release
	 *
	 * Called on release. Removes class from row.
	 */
	release: function( inSender, inEvent ) {

		if( this.tapHighlight ) {

			this.preventTapDisplayTimer = ( new Date() ).getTime();

			onyx.Item.removeFlyweightClass( ( this.controlParent || this ), this.highlightClass, inEvent );
		}
	}
});
