/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * gts.String
 *
 * Helper kind for using Strings. Aids in cleaning, viewing, validating, etc.
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requires Enyo (https://github.com/enyojs/enyo)
 */
enyo.singleton({
	name: "gts.String",
	kind: "enyo.Component",

	/** @public */
	published: {
		/** @lends gts.String# */

		/**
		 * Array of 'dirty' string items
		 * @type [string]
		 */
		dirtyItem: [ "&", "<", ">", '"', "`", "'", "\n" ],

		/**
		 * Array of 'clean' string items
		 * @type [string]
		 */
		cleanItem: [ "&amp;","$lt;", "&gt;",  "&quot;", "'", "'", "&crarr;" ]
	},

	/**
	 * @public
	 * @function
	 * @name gts.String#stripHTML
	 *
	 * Removes HTML tags and content between them from string
	 *
	 * @param string
	 * @return string
	 */
	stripHTML: function( str ) {

		if( str ) {

			return str.replace( /<\S[^><]*>/g, "" );
		} else {

			return "";
		}
	},

	/**
	 * @public
	 * @function
	 * @name gts.String#cleanString
	 *
	 * Replaces common 'bad' characters with safe equivalents
	 *
	 * @param string
	 * @return string
	 */
	cleanString: function( str ) {

		if( str ) {

			for( var i = 0; i < this.dirtyItem.length; i++ ) {

				str = str.replace( new RegExp( this.dirtyItem[i], "g" ), this.cleanItem[i] );
			}

			return str;
		} else {

			return "";
		}
	},

	/**
	 * @public
	 * @function
	 * @name gts.String#dirtyString
	 *
	 * Replaces safe equivalents with common 'bad' characters
	 *
	 * @param string
	 * @return string
	 */
	dirtyString: function( str ) {

		if( str ) {

			for( var i = 0; i < this.dirtyItem.length; i++ ) {

				str = str.replace( new RegExp( this.cleanItem[i], "g" ), this.dirtyItem[i] );
			}

			return str;
		} else {

			return "";
		}
	},

	/**
	 * @public
	 * @function
	 * @name gts.String#trim
	 *
	 * Removes all whitespace from start and end of string
	 *
	 * @param string
	 * @return string
	 */
	trim: function( str ) {

		if( str ) {

			return str.replace( /^\s\s*/, "" ).replace( /\s\s*$/, "" );
		} else {

			return "";
		}
	},

	/**
	 * @public
	 * @function
	 * @name gts.String#ucfirst
	 *
	 * Makes a string's first character uppercase
	 *
	 * @param string
	 * @return string
	 */
	ucfirst: function( str ) {

		if( str ) {

			var c = str.charAt( 0 ).toUpperCase();
			return( c + str.substr( 1 ) );
		} else {

			return "";
		}
	},

	/**
	 * @public
	 * @function
	 * @name gts.String#isBlank
	 *
	 * Checks if string is blank
	 *
	 * @param string
	 * @return boolean
	 */
	isBlank: function( str ) {

		if( str ) {

			return /^\s*$/.test( str );
		} else {

			return true;
		}
	},

	/**
	 * @public
	 * @function
	 * @name gts.String#isJSON
	 *
	 * Checks if string is JSON formatted
	 *
	 * @param string
	 * @return boolean
	 */
	isJSON: function( str ) {

		if( str && !this.isBlank( str ) ) {

			str = str.replace( /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@" );
			str = str.replace( /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]" );
			str = str.replace( /(?:^|:|,)(?:\s*\[)+/g, "" );

			return ( /^[\],:{}\s]*$/ ).test( str );
		} else {

			return false;
		}
	}
});
