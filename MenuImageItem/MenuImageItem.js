/**
 * @name gts.MenuImageItem
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * Easily add icons to Menu Items. If there is no icon added, the menu item will look and behave as normal.
 *
 * @class
 * @extends enyo.MenuItem
 * @see http://enyojs.com
 */
enyo.kind({
	name: "gts.MenuImageItem",
	kind: "onyx.MenuItem",

	classes: "gts-menuimageitem",

	published: {
		content: "",
		src: ""
	},

	components: [
		{
			name: "icon",
			kind: "onyx.IconButton",
			src: "",
			classes: "gts-mii-icon"
		}, {
			name: "text",
			content: "",
			classes: "gts-mii-text"
		}
	],

	create: function(){

		this.inherited( arguments );

		this.contentChanged();
		this.srcChanged();
	},

	contentChanged: function() {

		this.$['text'].setContent( this.content );
	},

	srcChanged: function() {

		this.$['icon'].setSrc( this.src );

		var hasIcon = ( this.src.length > 0 );

		this.$['icon'].setShowing( hasIcon );
		this.addRemoveClass( "has-icon", hasIcon );
	}
});
