/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * GTS.LazyList
 *
 * DESCRIPTION
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 * @requies Layout (https://github.com/enyojs/layout)
 *
 * @param {date}	[dateObj]	Initial date object set; defaults to current date
 * @param {viewDate}	[dateObj]	Initial viewing date; defaults to current date
 */
enyo.kind({
	name: "GTS.LazyList",
	kind: "enyo.PulldownList",

	classes: "gts-databaselist",

	/** @public */
	published: {
		buffer: 5,
		batchSize: 25,

		maxCount: -1
	},

	/** @public */
	events: {
	},

	/** @protected */
	handlers: {
		onSetupItem: "interceptor",
	},

	interceptor: function( inSender, inEvent ) {

		if( this.maxCount >= 0 && this.count >= this.maxCount ) {

			return;
		}

		if( ( inEvent.index + this.buffer ) > this.count ) {

			//try to fetch more
		}

		this.log( this.count, arguments );
	}
});
