'use strict';

var ThumbnailView = Parse.View.extend({
	className: 'thumbnail',

	thumbnailTemplate: _.template($('.thumbnail-template').text()),

	events: {
		"click" : "showDetailView"
	},

	initialize: function() {
		this.model.on('change', this.render.bind(this));
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