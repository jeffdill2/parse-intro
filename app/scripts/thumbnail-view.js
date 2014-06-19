'use strict';

////////////////////////////////////////////////////////////
///////////////////////////////// THUMBNAIL VIEW CONSTRUCTOR
////////////////////////////////////////////////////////////
var ThumbnailView = Parse.View.extend({
	className: 'thumbnail',

	thumbnailTemplate: _.template($('.thumbnail-template').text()),

	events: {
		"click" : "showDetailView"
	},

	initialize: function() {
		// When the model changes, the view will be re-rendered.
		this.model.on('change', this.render.bind(this));
		// When the model is destroyed, the view will be removed from the DOM.
		this.model.on('destroy', this.remove.bind(this));

		$('.image-gallery').prepend(this.el);
		this.render();
	},

	render: function() {
		var rendered = this.thumbnailTemplate(this.model.attributes);
		this.$el.html(rendered);
	},

	showDetailView: function() {
		new DetailView({model: this.model});
	}
});