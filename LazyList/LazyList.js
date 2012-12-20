/**
 * @name GTS.LazyList
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
	name: "GTS.LazyList",
	kind: "enyo.AroundList",

	lastLazyLoad: 0,

	published: {
		/** @lends GTS.LazyList# */

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
		/** @lends GTS.LazyList# */

		/**
		 * Aquire new pages of data
		 * @event
		 * @param {Object} inSender	Event's sender
		 * @param {Object} inEvent	Event parameters
		 */
		onAcquirePage: ""
	},

	/**
	 * @private
	 * @function
	 * @name GTS.LazyList#scroll
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

				this._requestData();
			}
		}

		return this.inherited( arguments );
	},

	/**
	 * @public
	 * @function
	 * @name GTS.LazyList#lazyLoad
	 *
	 * Resets list position and fetches new data
	 */
	lazyLoad: function() {

		this.lastLazyLoad = 0;

		this._requestData();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.LazyList#lazyLoad
	 *
	 * Request more data
	 */
	_requestData: function() {

		var moreData = this.doAcquirePage( {
				"page": this.lastLazyLoad,
				"pageSize": this.pageSize
			});

		this.log( moreData, new Date() );

		//show belowClient if moreData is true
	},

	/**
	 * @public
	 * @function
	 * @name GTS.LazyList#reset
	 * @extends enyo.AroundList#reset
	 */
	reset: function() {

		//hide

		this.inherited( arguments );
	}
});
