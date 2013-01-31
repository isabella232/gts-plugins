/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * gts.Object
 *
 * Helper kind for using Objects.
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requires Enyo (https://github.com/enyojs/enyo)
 */
enyo.singleton({
	name: "gts.Object",
	kind: "enyo.Component",

	/**
	 * @public
	 *
	 * Returns numbers from obj
	 *
	 * @param {object} obj
	 * @return {obj}
	 */
	numericValues: function( obj ) {

		return Object.values( obj ).select( this.isNumber );
	},

	/**
	 * @public
	 *
	 * More extensive number check on obj
	 *
	 * @param {object} obj
	 */
	validNumber: function( obj ) {

		return this.isNumber( obj ) && !isNaN( parseFloat( obj ) ) && isFinite( obj );
	},

	/**
	 * @public
	 *
	 * Exchanges the values between the two indexes
	 *
	 * @param {object} obj
	 * @param {string} index1
	 * @param {string} index2
	 * @return {object}
	 */
	swap: function( obj, index1, index2 ) {

		var swap = obj[index1];

		obj[index1] = obj[index2];
		obj[index2] = swap;

		return obj;
	},

	/**
	 * @public
	 *
	 * Returns the size of the object
	 *
	 * @param {object} obj
	 * @return int
	 */
	size: function( obj ) {

		var size = 0;
		var key;

		for( key in obj ) {

			if( obj.hasOwnProperty( key ) ) {

				size++;
			}
		}

		return size;
	},

	/**
	 * @public
	 *
	 * Is the object a function
	 *
	 * @param {object} obj
	 * @return boolean
	 */
	isFunction: function( obj ) {

		if( enyo.isFunction ) {

			return enyo.isFunction( obj );
		}

		return Object.prototype.toString.call( obj ) === "[object Function]";
	},

	/**
	 * @public
	 *
	 * Is the object a string
	 *
	 * @param {object} obj
	 * @return boolean
	 */
	isString: function( obj ) {

		if( enyo.isString ) {

			return enyo.isString( obj );
		}

		return Object.prototype.toString.call( obj ) === "[object String]";
	},

	/**
	 * @public
	 *
	 * Is the object a number
	 *
	 * @param {object} obj
	 * @return boolean
	 */
	isNumber: function( obj ) {

		return Object.prototype.toString.call( obj ) === "[object Number]";
	},

	/**
	 * @public
	 *
	 * Is the object a date
	 *
	 * @param {object} obj
	 * @return boolean
	 */
	isDate: function( obj ) {

		return Object.prototype.toString.call( obj ) === "[object Date]";
	},

	/**
	 * @public
	 *
	 * Is the object undefined
	 *
	 * @param {object} obj
	 * @return boolean
	 */
	isUndefined: function( obj ) {

		return typeof obj === "undefined";
	}
});
