/* Copyright © 2012, GlitchTech Science */

/**
 * @name GTS.GData
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * Simple styler for in page notification text.
 *
 * @class
 * @version 2.0 (2012/07/17)
 * @see http://enyojs.com
 */
enyo.kind({
	name: "GTS.GData",
	kind: enyo.Component,

	published: {
		/** @lends GTS.GData# */

		/**
		 * Type of account to allow
		 * @type string
		 * @default "HOSTED_OR_GOOGLE"
		 */
		acctType: "HOSTED_OR_GOOGLE",

		/**
		 * Name of application. Not changing this may result in blocked requests.
		 * @type string
		 * @default "error"
		 */
		appName: "anon_app",

		/**
		 * Version of API to use. Usually don't change this.
		 * @type string
		 * @default "error"
		 */
		version: "3.0"
	},

	/**
	 * @private
	 * @function
	 * @name GTS.GData#gdata_authenticate
	 *
	 * Performs AJAX call to get ClientAuth string for GDATA services
	 *
	 * @param {string}	username	gmail address of account to authenticate with
	 * @param {string}	password	password for username
	 * @param {string}	service	service to authenticate with (ex 'writely' for creating documents or 'wise' for listing/reading them)
	 *
	 * @param {object}	[options]	Callback functions & timeout setting
	 * @param {function}	[options.onSuccess]	callback function for a successful fetch
	 * @param {function}	[options.onError]	callback function for an unsuccessful fetch
	 * @param {int}	[options.timeout]	time (in seconds) before system aborts request
	 *
	 * @return {void}	onsuccess
	 * @return {string}	onfailure: returns the specific error message generated in gdata_general_failure
	 */
	gdata_authenticate: function( username, password, service, options ) {

		var authString = "https://www.google.com/accounts/ClientLogin?Email=" + escape( username ) + "&Passwd=" + escape( password ) + "&accountType=" + this.acctType + "&source=" + this.appName + "&service=" + service;

		var authRequest = new Ajax.Request(
				authString,
				{
					method: 'get',
					evalJSON: 'false',
					timeout: options['timeout'],
					onSuccess: enyo.bind( this, this.gdata_authenticate_success, options['onSuccess'] ),
					onFailure: enyo.bind( this, this.gdata_general_failure, options['onError'] )
				}
			);
	},

	/**
	 * @private
	 * Parses authentication information to extract key
	 *
	 * @param	{function}	callbackFn	function to notify successful run
	 * @param	{object}	response	requested information
	 */
	gdata_authenticate_success: function( callbackFn, response ) {

		this.gdata_authKey = "";

		var tempKeyArr = response.responseText.split( "\n" );

		for( var i = 0; i < tempKeyArr.length - 1; i++ ) {

			if( tempKeyArr[i].toLowerCase().indexOf( "auth=" ) !== -1 ) {

				this.gdata_authKey = "GoogleLogin auth=" + tempKeyArr[i].replace( /Auth=/i, "" );
				break;
			}
		}

		if( callbackFn && typeof( callbackFn ) === "function" ) {

			callbackFn();
		}
	},

	/**
	 * Performs AJAX call to get all spreadsheets in account
	 *
	 * @param {object}	[options]	Callback functions & timeout setting
	 * @param {function}	[options.onSuccess]	callback function for a successful fetch
	 * @param {function}	[options.onError]	callback function for an unsuccessful fetch
	 * @param {int}	[options.timeout]	time (in seconds) before system aborts request
	 *
	 * @return {void}	onsuccess
	 * @return {string}	onfailure: returns the specific error message generated in gdata_general_failure
	 */
	gdata_fetch_spreadsheet_list: function( options ) {

		if( this.gdata_authKey.length <= 0 ) {

			options['onError']( "No key found, please authenticate first." );
		}

		var sheetsRequest = new Ajax.Request(
				"https://spreadsheets.google.com/feeds/spreadsheets/private/full?alt=json",
				{
					method: 'get',
					requestHeaders: {
						"GData-Version": this.version,
						"Authorization": this.gdata_authKey
					},
					timeout: options['timeout'],
					onSuccess: this.gdata_fetch_spreadsheet_list_success.bind( this, options['onSuccess'] ),
					onFailure: this.gdata_general_failure.bind( this, options['onError'] )
				}
			);
	},

	/**
	 * @private
	 * Parses authentication information to extract spreadsheets
	 *
	 * @param	{function}	callbackFn	function to notify successful run
	 * @param	{object}	response	requested information
	 *
	 * @return {object[]}	all spreadsheet objects
	 */
	gdata_fetch_spreadsheet_list_success: function( callbackFn, response ) {

		var allSheetsObj = response.responseJSON.feed.entry;

		var sheetListObj = [];

		//Did the request return data
		if( !( typeof( allSheetsObj ) === "undefined" || allSheetsObj.length <= 0 ) ) {

			for( var i = 0; i < allSheetsObj.length; i++ ) {

				sheetListObj.push(
							{
								name: allSheetsObj[i]['title']['$t'],
								sheetKey: allSheetsObj[i]['id']['$t'].slice( allSheetsObj[i]['id']['$t'].lastIndexOf( "/" ) + 1 ),
								selectStatus: false
							}
					);
			}
		}

		if( callbackFn && typeof( callbackFn ) === "function" ) {

			callbackFn( sheetListObj );
		}
	},

	/**
	 * Performs AJAX call to get general information about this spreadsheet
	 *
	 * @param	{string}	sheetKey	id of spreadsheet to query
	 * @param {object}	[options]	Callback functions & timeout setting
	 * @param {function}	[options.onSuccess]	callback function for a successful fetch
	 * @param {function}	[options.onError]	callback function for an unsuccessful fetch
	 * @param {int}	[options.timeout]	time (in seconds) before system aborts request
	 *
	 * @return {object}	onsuccess: json object of spreadsheets
	 * @return {string}	onfailure: returns the specific error message generated in gdata_general_failure
	 */
	gdata_fetch_spreadsheet_summary: function( sheetKey, options ) {

		if( typeof( sheetKey ) === "undefined" ) {

			options['onError']( "No sheet key defined." );
		}

		var sheetsRequest = new Ajax.Request(
				"https://spreadsheets.google.com/feeds/worksheets/" + sheetKey + "/private/full?alt=json",
				{
					method: 'get',
					requestHeaders: {
						"GData-Version": this.version,
						"Authorization": this.gdata_authKey
					},
					timeout: options['timeout'],
					onSuccess: options['onSuccess'],//Integrate into model?
					onFailure: this.gdata_general_failure.bind( this, options['onError'] )
				});
	},

	/**
	 * Performs AJAX call to get specific information about this spreadsheet (List based feed)
	 *
	 * @param	{string}	sheetKey	id of spreadsheet to query
	 * @param	{string}	pageKey		id of page to query
	 * @param	{integer}	startIndex	row index to start fetching
	 * @param	{integer}	maxResults	max number of rows to fetch
	 *
	 * @param {object}	[options]	Callback functions & timeout setting
	 * @param {function}	[options.onSuccess]	callback function for a successful fetch
	 * @param {function}	[options.onError]	callback function for an unsuccessful fetch
	 * @param {int}	[options.timeout]	time (in seconds) before system aborts request
	 *
	 * @return {object} onsuccess: specific data about a spreadsheet
	 * @return {string}	onfailure: returns the specific error message generated in gdata_general_failure
	 */
	gdata_fetch_spreadsheet_data: function( sheetKey, pageKey, startIndex, maxResults, options ) {

		var sheetsRequest = new Ajax.Request(
				"https://spreadsheets.google.com/feeds/list/" + sheetKey + "/" + pageKey + "/private/full?alt=json&start-index=" + startIndex + "&max-results=" + maxResults,
				{
					method: 'get',
					evalJSON: 'false',
					requestHeaders: {
						"GData-Version": this.version,
						"Authorization": this.gdata_authKey
					},
					timeout: options['timeout'],
					onSuccess: options['onSuccess'],//Integrate into model? line 502
					onFailure: this.gdata_general_failure.bind( this, options['onError'] )
				});
	},

	/**
	 * Sends data to Google Docs as a single Spreadsheet
	 *
	 * @param	{string}	docTitle	Title of document to appear on Google Docs
	 * @param	{string}	docContent	Contents of the file. Each array row is a spreadsheet row. Each row should be in key: value format. (should be precleaned)
	 *
	 * @param {object}	[options]	Callback functions & timeout setting
	 * @param {function}	[options.onSuccess]	callback function for a successful fetch
	 * @param {function}	[options.onError]	callback function for an unsuccessful fetch
	 * @param {int}	[options.timeout]	time (in seconds) before system aborts request
	 *
	 * @return {void}	onsuccess: successful file upload
	 * @return {string}	onfailure: returns the specific error message generated in gdata_general_failure
	 */
	gdata_upload_spreadsheet: function( docTitle, docContent, options ) {

		//Convert key: value array

		var sheetsRequest = new Ajax.Request(
				"https://docs.google.com/feeds/upload/create-session/default/private/full?convert=false",
				{
					method: 'post',
					contentType: 'text/csv',
					'Content-Length': 0,
					postBody: '',
					requestHeaders: {
						'GData-Version': this.version,
						'Authorization': this.gdata_authKey,
						'Slug': docTitle,
						'X-Upload-Content-Type': 'text/csv',
						'X-Upload-Content-Length': 0//**TOTAL LENGTH OF DATA IN BYTES => ( string.length * 2 )
					},
					timeout: options['timeout'],
					onSuccess: options['onSuccess'],
					onFailure: this.gdata_general_failure.bind( this, options['onError'] )
				}
			);
	},

	/**
	 * @private
	 */
	gdata_upload_spreadsheet_2: function( docTitle, docContent, options, response ) {

		this.log( "REQUEST RETURNED" );
		this.log( "|" + response + "|" );

		//https://code.google.com/apis/documents/docs/3.0/developers_guide_protocol.html#ResumableUpload
	},

	/**
	 * Sends string to Google Docs (CURRENTLY ONLY SPREADSHEET UPLOAD)
	 *
	 * @param	{string}	docTitle	Title of document to appear on Google Docs
	 * @param	{string}	docContent	Contents of the file (should be precleaned)
	 *
	 * @param {object}	[options]	Callback functions & timeout setting
	 * @param {function}	[options.onSuccess]	callback function for a successful fetch
	 * @param {function}	[options.onError]	callback function for an unsuccessful fetch
	 * @param {int}	[options.timeout]	time (in seconds) before system aborts request
	 *
	 * @return {void}	onsuccess
	 * @return {string}	onfailure: returns the specific error message generated in gdata_general_failure
	 */
	gdata_upload_file: function( docTitle, docContent, options ) {

		var atomFeed = "<?xml version='1.0' encoding='UTF-8'?>" +
						'<entry xmlns="http://www.w3.org/2005/Atom">' +
						'<category scheme="http://schemas.google.com/g/2005kind"' +
						' term="http://schemas.google.com/docs/2007spreadsheet"/>' +
						'<title>' + docTitle.cleanString() + '</title>' +
						'</entry>';

		var postBody = '--END_OF_PART\r\n' +
						'Content-Type: application/atom+xml;\r\n\r\n' +
						atomFeed + '\r\n' +
						'--END_OF_PART\r\n' +
						'Content-Type: ' + 'text/csv' + '\r\n\r\n' +
						docContent + '\r\n' +
						'--END_OF_PART--\r\n';

		var sheetsRequest = new Ajax.Request(
				"https://docs.google.com/feeds/documents/private/full",
				{
					method: 'post',
					contentType: 'multipart/related; boundary=END_OF_PART',
					postBody: postBody,
					Slug: docTitle,
					"GData-Version": this.version,//Must be here to function, else ERR404
					requestHeaders: {
						"Authorization": this.gdata_authKey
					},
					timeout: options['timeout'],
					onSuccess: options['onSuccess'],
					onFailure: this.gdata_general_failure.bind( this, options['onError'] )
				}
			);
	},

	/**
	 * @private
	 * Parses error informaiton, displays error message
	 *
	 * @param	{function}	callbackFn	function to notify successful run
	 * @param	{object}	failure	requested information
	 * @param	{string} timeout		var to check if failure was due to timeout
	 *
	 * @return {string}	returns error string via callbackFn
	 */
	gdata_general_failure: function( callbackFn, failure, timeout ) {
		//inSender, inResponse, inRequest

		var error_str = "";

		if( timeout && timeout === "timeout" ) {

			error_str = "The request timed out. Please check your network connection and try again.";

		} else if( failure.responseText.match( "Error=BadAuthentication" ) ) {

			error_str = "Did you enter your username and password correctly?";

		} else if( failure.responseText.match( "Error=CaptchaRequired" ) ) {

			error_str = "Google is requesting that you complete a CAPTCHA Challenge. Please go to <a href='https://www.google.com/accounts/DisplayUnlockCaptcha'>https://www.google.com/accounts/DisplayUnlockCaptcha</a> to complete it.";

		} else if( failure.responseText.match( "Error=NotVerified" ) ) {

			error_str = "The account email address has not been verified. You will need to access your Google account directly to resolve the issue before logging in using a non-Google application.";

		} else if( failure.responseText.match( "Error=TermsNotAgreed" ) ) {

			error_str = "You have not agreed to Google's terms. You will need to access your Google account directly to resolve the issue before logging in using a non-Google application.";

		} else if( failure.responseText.match( "Error=AccountDeleted" ) ) {

			error_str = "The user account has been deleted and is therefore unable to log in.";

		} else if( failure.responseText.match( "Error=AccountDisabled" ) ) {

			error_str = "The user account has been disabled. Please contact Google.";

		} else if( failure.responseText.match( "Error=ServiceDisabled" ) ) {

			error_str = "Your access to the specified service has been disabled. (Your account may still be valid.)";

		} else if( failure.responseText.match( "Error=ServiceUnavailable" ) ) {

			error_str = "The service is not available; try again later.";

		} else if( failure.responseText.match( "Error=Unknown" ) ) {

			error_str = "Unknown Error. Did you enter your username and password correctly?";

		} else {

			error_str = "There has been an error: " + failure.responseText;
		}

		if( callbackFn && typeof( callbackFn ) === "function" ) {

			callbackFn( error_str );
		}
	}
});
