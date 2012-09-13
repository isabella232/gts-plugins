/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * GTS.gapi
 *
 * Helper kind for using Google API (gapi). Handles authentication and loading modules.
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 */
enyo.kind({
	name: "GTS.Gapi",

	nextSteps: {},

	/** @public */
	published: {
		/** @lends GTS.Gapi# */

		/**
		 * Most Google APIs require an API key. You can sign up for an API key at the Google APIs Console (https://code.google.com/apis/console/).
		 * @type string
		 * @default ""
		 */
		apiKey: "",

		/**
		 * API Client ID
		 * @type string
		 * @default ""
		 */
		clientId: "",

		/**
		 * Scope for current authentication
		 * @type [string]
		 * @default []
		 */
		scope: []
	},

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends GTS.Gapi# */

		/**
		 * Base library loaded
		 * @event
		 * @param {Object} inSender	Event's sender
		 * @param {Object} inEvent	Event parameters
		 */
		onReady: ""
	},

	/**
	 * @protected
	 * @constructs
	 */
	constructor: function() {

		// Run our default construction
		this.inherited( arguments );

		this._binds = {
				"_handleAuthResult": enyo.bind( this, this.handleAuthResult )
			};
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.Gapi#create
	 *
	 * Called by Enyo when created. Loaded base Google API if needed.
	 */
	create: function() {

		this.inherited( arguments );

		if( !this.isGapiReady() ) {

			this.loadGapi();
		} else {

			this.doReady();
			this.apiKeyChanged();
		}
	},

	/**
	 * @public
	 * @function
	 * @name GTS.Gapi#isGapiReady
	 *
	 * Checks if gapi is ready
	 *
	 * @return boolean
	 */
	isGapiReady: function() {

		return !( typeof( gapi ) === 'undefined' );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.Gapi#loadGapi
	 *
	 * Fetch gapi
	 */
	loadGapi: function() {

		new enyo.JsonpRequest( {
				url: "https://apis.google.com/js/client.js",
				callbackName: "onload"
			})
			.go()
			.response( this, "gapiLoaded" );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.Gapi#gapiLoaded
	 *
	 * Handler for loading gapi
	 */
	gapiLoaded: function() {

		if( this.apiKey != "" ) {

			this.apiKeyChanged();
		}

		this.doReady();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.Gapi#apiKeyChanged
	 *
	 * Called by Enyo when this.apiKey is changed by host.
	 */
	apiKeyChanged: function() {

		gapi.client.setApiKey( this.apiKey );
	},

	/**
	 * @public
	 * @function
	 * @name GTS.Gapi#getAuthToken
	 *
	 * Fetchs the oauth token from the api (if set)
	 *
	 * @return {token obj}
	 */
	getAuthToken: function() {

		return gapi.auth.getToken();
	},

	/**
	 * @public
	 * @function
	 * @name GTS.Gapi#setAuthToken
	 *
	 * Sets the oauth token
	 *
	 * @param {obj} token	OAuth token
	 * @param {string}	token.access_token  The OAuth 2.0 token. Only present in successful responses.
	 * @param {string}	token.error         Details about the error. Only present in error responses.
	 * @param {string}	token.expires_in    The duration, in seconds, the token is valid for. Only present in successful responses.
	 * @param {string}	token.state         The Google API scopes related to this token.
	 */
	setAuthToken: function( token ) {

		return gapi.auth.setToken( token );
	},

	/**
	 * @public
	 * @function
	 * @name GTS.Gapi#auth
	 *
	 * Authorize with OAuth2. Refreshes the token if set
	 *
	 * @param {object} [options]	Callback functions
	 * @param {function [options.onSuccess]	execute once authorization obtained
	 * @param {function} [options.onError]	execute if an error occurs
	 */
	auth: function( options ) {

		this.nextSteps = options;

		gapi.auth.authorize( { "client_id": this.clientId, "scope": this.scope.join( " " ), "immediate": true }, this._binds['_handleAuthResult'] );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.Gapi#handleAuthResult
	 *
	 * Handles response from server
	 *
	 * @param {object} authResult	OAuth results
	 */
	handleAuthResult: function( authResult ) {

		if( this.$['authPop'] ) {

			this.$["authPop"].hide();
			this.$['authPop'].destroy();
		}

		if( authResult && !authResult.error ) {

			if( enyo.isFunction( this.nextSteps.onSuccess ) ) {

				this.nextSteps.onSuccess();
			}
		} else {

			var struct = {
				name: "authPop",
				kind: "onyx.Popup",

				centered: true,
				floating: true,
				modal: true,
				scrim: true,

				components: [
					{
						content: "Authenticate with Google",
						classes: "margin-half-bottom bigger text-center"
					}, {
						kind: "onyx.Button",
						content: "Cancel",
						ontap: "handleAuthAbort",
						classes: "onyx-negative",

						style: "margin-right: 15px;"
					}, {
						kind: "onyx.Button",
						content: "Authenticate",
						onclick: "handleAuthClick",
						classes: "onyx-affirmative"
					}
				]
			};

			this.createComponent( struct );

			this.render();

			this.$["authPop"].show();
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.Gapi#handleAuthAbort
	 *
	 * Exits auth attempt
	 */
	handleAuthAbort: function() {

		this.$["authPop"].hide();

		if( enyo.isFunction( this.nextSteps.onError ) ) {

			this.nextSteps.onError();
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.Gapi#handleAuthClick
	 *
	 * Handler to start pop-up auth
	 */
	handleAuthClick: function() {

		gapi.auth.authorize( { "client_id": this.clientId, "scope": this.scope.join( " " ), "immediate": false }, this._binds['_handleAuthResult'] );
	},

	/**
	 * @public
	 * @function
	 * @name GTS.Gapi#loadModule
	 *
	 * Loads the specified module.
	 *
	 * @param {string} name	name of the API
	 * @param {integer} version	version of the API
	 *
	 * @param {object} [options]	Callback functions
	 * @param {function [options.onSuccess]	execute once the details of the API have been loaded
	 * @param {function} [options.onError]	executre if API is unable to load
	 */
	loadModule: function( name, version, options ) {

		if( !this.isGapiReady() ) {

			options.onError( { "message": "Google API not ready yet." } );

			return;
		}

		if( typeof( gapi.client[name] ) === "undefined" ) {

			gapi.client.load( name, ( "v" + version ), options.onSuccess );
		} else {

			if( enyo.isFunction( options.onSuccess ) ) {

				options.onSuccess();
			}
		}
	}
});
