/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * gts.gapi
 *
 * Helper kind for using Google API (gapi). Handles authentication and loading modules.
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requires Enyo (https://github.com/enyojs/enyo)
 * @requires Phonegap-InAppBrowser (if used on a mobile device)
 */
enyo.kind({
	name: "gts.Gapi",

	nextSteps: {},
	phonegapInAppBrowser: false,

	/** @public */
	published: {
		/** @lends gts.Gapi# */

		/**
		 * Most Google APIs require an API key. You can sign up for an API key at the Google APIs Console (https://code.google.com/apis/console/).
		 * @type string
		 * @default ""
		 */
		apiKey: "",

		/**
		 * API Client ID. This is obtained during application registration
		 * @type string
		 * @default ""
		 */
		clientId: "",

		/**
		 * API Client Secret. This is obtained during application registration
		 * @type string
		 * @default ""
		 */
		clientSecret: "",

		/**
		 * Scope for current authentication
		 * @type [string]
		 * @default []
		 */
		scope: [],

		/**
		 * GAPI Auth Settings. Not advisible to modify
		 * @type {}
		 */
		gapiConfig: {

			endpoint: "https://accounts.google.com/o/oauth2/auth",
			endtoken: "https://accounts.google.com/o/oauth2/token", // token endpoint

			response_type: "code",

			redirect_uri: "http://localhost",

			/* stores access Token's Expiry Limit. Uses 58 min. instead of 60 min. */
			accessTokenExpireLimit: ( 58 * 60 * 1000 ),

			/* As defined in the OAuth 2.0 specification, this field must contain a value
			 * of "authorization_code" or "refresh_token" */
			grantTypes: { AUTHORIZE: "authorization_code", REFRESH: "refresh_token" },

			access_type: "offline",

			// ## Not required to be updated: only used for echoing ##
			state: "lligtaskinit"
		}
	},

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends gts.Gapi# */

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
				"_cbUrlChanged": enyo.bind( this, this.cbUrlChanged ),
				"_exitIAB": enyo.bind( this, this.exitIAB ),
				"_handleAuthResult": enyo.bind( this, this.handleAuthResult )
			};
	},

	/**
	 * @protected
	 * @function
	 * @name gts.Gapi#create
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
	 * @name gts.Gapi#isGapiReady
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
	 * @name gts.Gapi#loadGapi
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
	 * @name gts.Gapi#gapiLoaded
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
	 * @name gts.Gapi#apiKeyChanged
	 *
	 * Called by Enyo when this.apiKey is changed by host.
	 */
	apiKeyChanged: function() {

		gapi.client.setApiKey( this.apiKey );
	},

	/**
	 * @public
	 * @function
	 * @name gts.Gapi#getAuthToken
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
	 * @name gts.Gapi#setAuthToken
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
	 * @name gts.Gapi#auth
	 *
	 * Authorize with OAuth2. Refreshes the token if set
	 *
	 * @param {object} [options]	Callback functions
	 * @param {function [options.onSuccess]	execute once authorization obtained
	 * @param {function} [options.onError]	execute if an error occurs
	 */
	auth: function( options ) {

		this.nextSteps = options;

		if( window.device && ( enyo.platform.android || enyo.platform.androidChrome ) ) {
			//Use custom authentication system (Android only)

			var accessToken = this.getAuthToken();

			if( /* DISABLED PATH */ 1 == 2 && /* DISABLED PATH */ accessToken && accessToken['access_token'] ) {
				//Phonegap method doesn't like to restore token from memory

				this.log( "Phonegap token refresh" );

				this.getAuthToken( options );
			} else {

				this.log( "Phonegap-InAppBrowser Auth" );

				var authArgs = {
						"client_id": encodeURIComponent( this.clientId ),
						"scope": encodeURIComponent( this.scope.join( " " ) ),

						"redirect_uri": encodeURIComponent( this.gapiConfig.redirect_uri ),
						"response_type": encodeURIComponent( this.gapiConfig.response_type ),
						"state": encodeURIComponent( this.gapiConfig.state ),
						"access_type": encodeURIComponent( this.gapiConfig.access_type ),
						"approval_prompt": "force"
					};

				var authUri = this.gapiConfig.endpoint + "?" + Object.keys( authArgs ).map( function( x ) { return( x + "=" + authArgs[x] ); } ).join( "&" );

				// Now open new browser
				this.openIAB( authUri, "_blank", "location=no" );
			}
		} else {
			//This doesn't work in Android/Phonegap, wonder why.

			gapi.auth.authorize( { "client_id": this.clientId, "scope": this.scope.join( " " ), "immediate": true }, this._binds['_handleAuthResult'] );
		}
	},

	/**
	 * @private
	 * @function
	 * @name gts.Gapi#openIAB
	 *
	 * Opens new window and binds events
	 */
	openIAB: function( url, target, options ) {

		this.closeIAB();

		this.phonegapInAppBrowser = window.open( url, target, options );
		this.bindIABEvents();
	},

	/**
	 * @private
	 * @function
	 * @name gts.Gapi#closeIAB
	 *
	 * Closes additional window
	 */
	closeIAB: function() {

		// Now open new browser
		if( this.phonegapInAppBrowser ) {

			this.phonegapInAppBrowser.close();
		}
	},

	/**
	 * @private
	 * @function
	 * @name gts.Gapi#exitIAB
	 *
	 * Handles exiting the new window
	 */
	exitIAB: function() {

		this.unbindIABvents();
		this.phonegapInAppBrowser = false;
	},

	/**
	 * @private
	 * @function
	 * @name gts.Gapi#bindIABEvents
	 *
	 * Adds in app browser bindings
	 */
	bindIABEvents: function() {

		if( !this.phonegapInAppBrowser ) {

			return;
		}

		this.phonegapInAppBrowser.addEventListener( 'exit', this._binds['_exitIAB'] );
		this.phonegapInAppBrowser.addEventListener( 'loadstart', this._binds['_cbUrlChanged'] );
		//this.phonegapInAppBrowser.addEventListener( 'loadstop', this._binds['_cbUrlChanged'] );
	},

	/**
	 * @private
	 * @function
	 * @name gts.Gapi#unbindIABEvents
	 *
	 * Removes in app browser bindings
	 */
	unbindIABEvents: function() {

		if( !this.phonegapInAppBrowser ) {

			return;
		}

		this.phonegapInAppBrowser.removeEventListener( 'exit', this._binds['_exitIAB'] );
		this.phonegapInAppBrowser.removeEventListener( 'loadstart', this._binds['_cbUrlChanged'] );
		//this.phonegapInAppBrowser.removeEventListener( 'loadstop', this._binds['_cbUrlChanged'] );
	},

	/**
	 * @private
	 * @function
	 * @name gts.Gapi#getParameterByName
	 *
	 * Gets called when the URL changes on OAuth authorization process
	 *
	 * @param {object} inEvent	Event object
	 * @param {string} inEvent.url The URI Location
	 */
	cbUrlChanged: function( inEvent ) {

		this.log( arguments );

		if( inEvent.url.indexOf( "code=" ) != -1 ) {

			this.log( "Authenticated" );

			//close the browser
			this.closeIAB();

			/* Store the authCode temporarily */
			var token = this.getParameterByName( "code", inEvent.url );

			enyo.job( "refreshFromUrlChange", enyo.bind( this, this.getRefreshToken, token, this.nextSteps ), 1000 );
		} else if( inEvent.url.indexOf( "error=" ) != -1 ) {

			// close the browser
			this.closeIAB();

			if( enyo.isFunction( this.nextSteps.onError ) ) {

				this.nextSteps.onError( this.getParameterByName( "error", inEvent.url ) );
			}
		} else {

			this.log( "Status unknown: " + inEvent.url );
		}
   },

	/**
	 * @private
	 * @function
	 * @name gts.Gapi#getParameterByName
	 *
	 * Extracts the code from the url. Copied from online.
	 *
	 * @param name The parameter whose value is to be grabbed from url
	 * @param url  The url to be grabbed from.
	 *
	 * @return Returns the Value corresponding to the name passed
	 */
   getParameterByName: function( name, url ) {

		name = name.replace( /[\[]/, "\\\[" ).replace( /[\]]/, "\\\]" );

		var regex = new RegExp( "[\\?&]" + name + "=([^&#]*)" );
		var results = regex.exec(url);

		if( results == null ) {

			return false;
		} else {

			return decodeURIComponent( results[1].replace( /\+/g, " " ) );
		}
	},

	/**
	 * @public
	 * @function
	 * @name gts.Gapi#getAccessToken
	 *
	 * Retrieve the proper access token.
	 *
	 * @param {object} [options]	Callback functions
	 * @param {function [options.onSuccess]	execute once authorization obtained
	 * @param {function} [options.onError]	execute if an error occurs
	 */
	getAccessToken: function( options ) {

		this.log( "Update token" );

		this.nextSteps = {};

		var currentTime = ( new Date() ).getTime();

		var accessToken = this.getAuthToken();

		//Is token still valid?
		if( accessToken && accessToken['access_token'] && currentTime < ( accessToken['expires_in'] + this.gapiConfig.accessTokenExpireLimit ) ) {

			if( enyo.isFunction( options.onSuccess ) ) {

				options.onSuccess();
			}

			return;
		}

		this.log( "Fetching fresh token" );

		var x = new enyo.Ajax( {
				"url": this.gapiConfig.endtoken,
				"method": "POST",
				"postBody": {
					"client_id": this.clientId,
					"client_secret": this.clientSecret,

					"refresh_token": accessToken['access_token'],

					"redirect_uri": this.gapiConfig.redirect_uri,
					"grant_type": this.gapiConfig.grantTypes.AUTHORIZE
				}
			});

		x.go();

		x.response( this, function( inSender, inResponse ) {

				this.log( "Access complete" );

				var accessToken = {
						"access_token": inResponse['access_token']
					};

				this.setAuthToken( accessToken );

				inResponse['error'] = false;

				if( enyo.isFunction( options.onSuccess ) ) {

					options.onSuccess( inResponse );
				}

				return true;
			});

		x.error( this, function( inSender, inResponse ) {

				this.log( "Access error" );

				if( enyo.isFunction( options.onError ) ) {

					inResponse['error'] = true;

					options.onError( inResponse );
				}

				return true;
			});
	},

	/**
	 * @public
	 * @function
	 * @name gts.Gapi#getRefreshToken
	 *
	 * Gets the Refresh from Access Token. This method is only called internally,
	 * and once, only after when authorization of Application happens.
	 *
	 * @param {object} [options]	Callback functions
	 * @param {function [options.onSuccess]	execute once authorization obtained
	 * @param {function} [options.onError]	execute if an error occurs
	 */
	getRefreshToken: function( authCode, options ) {

		this.log( "Refresh token" );

		var x = new enyo.Ajax( {
				"url": this.gapiConfig.endtoken,
				"method": "POST",
				"postBody": {
					"code": authCode,

					"client_id": this.clientId,
					"client_secret": this.clientSecret,

					"redirect_uri": this.gapiConfig.redirect_uri,
					"grant_type": this.gapiConfig.grantTypes.AUTHORIZE
				}
			});

		x.go();

		x.response( this, function( inSender, inResponse ) {

				this.log( "Refresh complete", enyo.json.stringify( inResponse ) );

				this.setAuthToken( inResponse );

				if( enyo.isFunction( options.onSuccess ) ) {

					options.onSuccess( inResponse );
				}

				return true;
			});

		x.error( this, function( inSender, inResponse ) {

				this.log( "Refresh error", enyo.json.stringify( inResponse ) );

				if( enyo.isFunction( options.onError ) ) {

					inResponse['error'] = true;

					options.onError( inResponse );
				}

				return true;
			});
	},

	/**
	 * @private
	 * @function
	 * @name gts.Gapi#handleAuthResult
	 *
	 * Handles response from server
	 *
	 * @param {object} authResult	OAuth results
	 */
	handleAuthResult: function( authResult ) {

		if( this.$['authPop'] ) {

			this.$['authPop'].hide();
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
						classes: "text-center",
						components: [
							{
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
					}
				]
			};

			this.createComponent( struct );

			this.render();

			this.$['authPop'].show();

			var zIndex = this.$['authPop'].getComputedStyleValue( "zIndex" );

			if( !zIndex ) {

				var css = this.$['authPop'].domCssText.split( ";" );

				for( var i = 0; i < css.length; i++ ) {

					if( css[i].match( "z-index" ) ) {

						css = css[i].split( ":" );
						zIndex = css[1];
						break;
					}
				}
			}

			this.$['authPop'].applyStyle( "z-index", ( ( zIndex - 5 ) + 10 ) );

			this.$['authPop'].reflow();
		}
	},

	/**
	 * @private
	 * @function
	 * @name gts.Gapi#handleAuthAbort
	 *
	 * Exits auth attempt
	 */
	handleAuthAbort: function() {

		this.$['authPop'].hide();

		if( enyo.isFunction( this.nextSteps.onError ) ) {

			this.nextSteps.onError();
		}
	},

	/**
	 * @private
	 * @function
	 * @name gts.Gapi#handleAuthClick
	 *
	 * Handler to start pop-up auth
	 */
	handleAuthClick: function() {

		gapi.auth.authorize( { "client_id": this.clientId, "scope": this.scope.join( " " ), "immediate": false }, this._binds['_handleAuthResult'] );
	},

	/**
	 * @public
	 * @function
	 * @name gts.Gapi#loadModule
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
