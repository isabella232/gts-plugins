/* Copyright © 2011-2012, GlitchTech Science */

/**
 * @name gts.EventMenu
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * Extends the Onyx Menu to allow for placement using a tap (or similar) event.
 * Show component with enyo.Popup#showAtEvent( inEvent ).
 *		Open at the location of a mouse event (_inEvent_). The popup's
 *		position is automatically constrained so that it does not
 *		display outside the viewport, and defaults to anchoring the top
 *		left corner of the popup to the mouse event.
 *
 *		_inOffset_ is an optional object which may contain left and top
 *		properties to specify an offset relative to the location the
 *		popup would otherwise be positioned.
 *
 *
 * @class
 * @version 2.0 (2013/01/31)
 * @requires onyx 2.1
 * @extends onyx.Menu
 * @see http://enyojs.com
 */
enyo.kind({
	name: "gts.EventMenu",
	kind: "onyx.Menu",

	/**
	 * @protected
	 * @name gts.EventMenu#adjustPosition
	 *
	 * Overrides parent adjustPosition function.
	 * That function is not needed for this use.
	 */
	adjustPosition: function() {},

	/**
	 * @protected
	 * @name gts.EventMenu#showingChanged
	 *
	 * Altered to use updatePosition.
	 */
	showingChanged: function() {

		this.inherited( arguments );
		this.updatePosition();
	},

	/**
	 * @protected
	 * @name gts.EventMenu#resizeHandler
	 *
	 * Altered to use updatePosition.
	 */
	resizeHandler: function() {

		this.inherited( arguments );
		this.updatePosition();
	}
});
