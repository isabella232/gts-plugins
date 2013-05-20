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
			kind: "onyx.Icon",
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
