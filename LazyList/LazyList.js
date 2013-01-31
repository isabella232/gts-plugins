/**
 * @name gts.LazyList
 * @author Newness (Rafa Bernad)
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * Lazy loading list. Found in a merge request on the official enyo github.
 * Included in here to make use of it until an official solution is released.
 * Released under the gts namespace to prevent future conflicts. Code cleaned
 * up some and changed to my needs.
 *
 * @class
 * @extends enyo.AroundList
 * @see http://enyojs.com
 */
enyo.kind({
	name: "gts.LazyList",
	kind: "enyo.AroundList",

	lastLazyLoad: 0,

	published: {
		/** @lends gts.LazyList# */

		/**
		 * Page size
		 * @type int
		 * @default 50
		 */
		pageSize: 50
	},

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends gts.LazyList# */

		/**
		 * Aquire new pages of data
		 * @event
		 * @param {Object} inSender	Event's sender
		 * @param {Object} inEvent	Event parameters
		 */
		onAcquirePage: ""
	},

	/**
	 * @protected
	 * @constructs
	 */
	constructor: function() {

		this.inherited( arguments );

		this.binds = {
			_requestData: enyo.bind( this, this._requestData )
		};
	},

	/**
	 * @public
	 * @function
	 * @name gts.LazyList#lazyLoad
	 *
	 * Resets list position and fetches new data
	 */
	lazyLoad: function() {

		this.lastLazyLoad = 0;

		this._requestData();
	},

	/**
	 * @protected
	 * @function
	 * @name gts.LazyList#scroll
	 * @extends enyo.AroundList#scroll
	 *
	 * Overrides scroll to check for & request new data
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	scroll: function( inSender, inEvent ) {

		var s = this.getStrategy().$.scrollMath;

		if( ( s.isInOverScroll() && s.y < 0 ) || ( s.y < ( s.bottomBoundary + this.$['belowClient'].hasNode().offsetHeight ) ) ) {

			if( this.lastLazyLoad < this.pageCount ) {

				this.lastLazyLoad = this.pageCount;

				enyo.job( "gts.LazyList#_requestData", this.binds['_requestData'], 250 );
			}
		}

		return this.inherited( arguments );
	},

	/**
	 * @protected
	 * @function
	 * @name gts.LazyList#_requestData
	 *
	 * Request more data
	 */
	_requestData: function() {

		var moreData = this.doAcquirePage( {
				"page": this.lastLazyLoad,
				"pageSize": this.pageSize
			});

		//show belowClient if moreData is true
	},

	/**
	 * @public
	 * @function
	 * @name gts.LazyList#reset
	 * @extends enyo.AroundList#reset
	 */
	reset: function() {

		//hide

		this.inherited( arguments );
	}
});
