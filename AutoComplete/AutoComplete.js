/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * GTS.AutoComplete
 *
 * Menu contained within an input decorator to present text suggestions.
 * Suggestions are user generated.
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 * @requies Onyx (https://github.com/enyojs/onyx)
 */
enyo.kind( {
	name: "GTS.AutoComplete",
	kind: "onyx.InputDecorator",

	classes: "gts-autocomplete",

	/**
	 * @private
	 * Needed to support menu
	 * @type boolean
	 * @default false
	 */
	active: false,

	/**
	 * @private
	 * Search term history validation
	 * @type [string]
	 * @default []
	 */
	searchValues: [],

	/** @public */
	published: {
		/** @lends GTS.AutoComplete# */

		/**
		 * Is system active
		 * @type boolean
		 * @default true
		 */
		enabled: true,

		/**
		 * list of values for suggest list
		 * @type [string]
		 * @default ""
		 */
		values: "",

		/**
		 * Max results to display
		 * @type number
		 * @default 50
		 */
		limit: 50,

		/**
		 * Delay between text entry and search
		 * @type number
		 * @default 200
		 */
		delay: 200,

		/**
		 * Icon to display
		 * @type string
		 * @default "assets/search.png"
		 */
		icon: "assets/search.png",

		/**
		 * Option z-index. Used in situations where autocomplete is in a popup
		 * @type number/boolean
		 * @default false
		 */
		zIndex: false,

		/**
		 * Allow <, >, &, etc
		 * @type boolean
		 * @default true
		 */
		allowDirty: true
	},

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends GTS.AutoComplete# */

		/**
		 * Even to respond to when data is required for the drop down
		 * @event
		 * @param {Object} inSender	Event's sender
		 * @param {Object} inEvent	{}
		 * @param string inEvent.value	Value of the input field
		 * @param function inEvent.callback	Function to call with result data in a simple array
		 */
		onDataRequested: "",

		/**
		 * Input's onInput event (once every delay)
		 * @event
		 * @param {Object} inSender	Event's sender
		 * @param {Object} inEvent	{}
		 * @param string inEvent.value	Value of the input field
		 */
		onInputChanged: "",

		/**
		 * Item selected from menu
		 * @event
		 * @param {Object} inSender	Event's sender
		 * @param {Object} inEvent	(from Menu onSelect event)
		 * @param string inEvent.value	Value of the input field
		 */
		onValueSelected: ""
	},

	/** @private */
	components:[
		{
			name: "options",
			kind: "onyx.Menu",
			floating: true
		}, {
			name: "icon",
			classes: "search-icon"
		},
	],

	/** @private */
	handlers: {
		oninput: "inputChanged",
		onSelect: "itemSelected",
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.AutoComplete#rendered
	 *
	 * Called by Enyo when UI is rendered.
	 */
	rendered: function() {

		this.inherited( arguments );

		this.enabledChanged();
		this.iconChanged();
		this.zIndexChanged();
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.AutoComplete#enabledChanged
	 *
	 * Called by Enyo when this.enabled is changed by user
	 */
	enabledChanged: function() {

		this.iconChanged();
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.AutoComplete#iconChanged
	 *
	 * Called by Enyo when this.icon is changed by user
	 */
	iconChanged: function() {

		this.$['icon'].applyStyle( "background-image", this.icon );
		this.$['icon'].setShowing( this.enabled && this.icon != "" );
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.AutoComplete#zIndexChanged
	 *
	 * Called by Enyo when this.zIndex is changed by user
	 */
	zIndexChanged: function() {

		if( this.zIndex !== false ) {

			this.$['options'].applyStyle( "z-index", this.zIndex );
		} else {

			this.$['options'].applyStyle( "z-index", null );
		}
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.AutoComplete#inputChanged
	 *
	 * Called by Enyo when the content of the input is changed by end-user
	 */
	inputChanged: function( source, event ) {

		if( !this.enabled ) {

			return;
		}

		this.inputField = this.inputField || event.originator;

		enyo.job( null, enyo.bind( this, "fireInputChanged" ), this.delay );
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.AutoComplete#fireInputChanged
	 *
	 * Delay action handling of onInput via enyo.job
	 * Request data from onDataRequest handler
	 */
	fireInputChanged: function() {

		var searchValue = this.inputField.getValue();

		this.doInputChanged( { "value": this.inputField.getValue() } );

		if( searchValue.length <= 0 ) {

			this.waterfall( "onRequestHideMenu", { activator: this } );

			//Clear search history
			this.searchValues.slice( 0, 0 );
			return;
		}

		this.searchValues.push( searchValue );
		this.doDataRequested( { "value": this.inputField.getValue(), "limit": this.limit } );
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.AutoComplete#valuesChanged
	 *
	 * Display menu of suggestions
	 */
	valuesChanged: function() {

		var searchValue = this.inputField.getValue();
		var len = this.searchValues.length;

		//Most recent search value
		if( len <= 0 || this.searchValues.indexOf( searchValue ) != ( len - 1 ) ) {

			return;
		}

		//Clear search history
		this.searchValues.slice( 0, 0 );

		this.values = this.values.slice( 0, this.limit );

		if( !this.values || this.values.length === 0 ) {

			this.waterfall( "onRequestHideMenu", { activator: this } );
			return;
		}

		this.$['options'].destroyClientControls();
		var c = [];

		for( var i = 0; i < this.values.length; i++ ) {

			c.push( {
					"content": this.values[i],
					index: i,
					allowHtml: true
				});
		}

		this.$['options'].createComponents( c );
		this.$['options'].render();

		this.waterfall( "onRequestShowMenu", { activator: this } );
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.AutoComplete#input
	 *
	 * Updates input field with menu selection, sends event with value to handler
	 */
	itemSelected: function( inSender, inEvent ) {

		if( inEvent.content && inEvent.content.length > 0 ) {

			inEvent.content = this.dirtyString( inEvent.content );

			this.inputField.setValue( inEvent.content );
		}

		this.doValueSelected( enyo.mixin( inEvent, { "value": this.inputField.getValue() } ) );
	},

	/** @private */
	dirtyString: function( string ) {

		if( !this.allowDirty ) {

			return string;
		}

		var cleanItem = [ /&amp;/g, /&quot;/g, /$lt;/g, /&gt;/g, /&rsquo;/g, /&nbsp;/g ];
		var dirtyItem = [ "&", '"', "<", ">", "'", " " ];

		for( var i = 0; i < dirtyItem.length; i++ ) {

			string = string.replace( cleanItem[i], dirtyItem[i] );
		}

		return string;
	}
});
