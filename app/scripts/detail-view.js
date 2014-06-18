'use strict';

var DetailView = Parse.View.extend({
	className: 'detail',

	detailTemplate: _.template($('.detail-template').text()),

	events: {
		"click .upload-button" 	: "upload",
		"click .preview-button"	: "preview",
		"click .update-button"	: "update",
		"click .delete-button"	: "destroy"
	},

	initialize: function() {
		$('.image-form').html('');
		$('.image-form').append(this.el);
		this.render();
	},

	render: function() {
		var rendered = this.detailTemplate(this.model.attributes);
		this.$el.html(rendered);
		return this;
	},

	reset: function() {
		new DetailView({model: placeholderModel});
	},

	upload: function() {
		var fileUploadControl = $(".image-file-selector")[0];
		var objParseFile = {};

		if (fileUploadControl.files.length > 0) {
			var objFile = fileUploadControl.files[0];
			var strFilename = $('.image-file-selector').val().split('\\').pop().split('/').pop();

			objParseFile = new Parse.File(strFilename, objFile);
			objParseFile.save();
		} else {
			alert('You must select a file to upload!');
			return;
		}

		var image = new Image();

		image.save({
			image: objParseFile,
			comment: $('.form-comment').val(),
			isPlaceholder: false
		}, {
			success: function() {
				console.log('HUZZAH!');
			},
			error: function() {
				console.log('OOPS!');
			}
		});

		new ThumbnailView({model: image});

		this.remove();
		this.reset();
	},

	preview: function() {
		var fileUploadControl = $(".image-file-selector")[0];
		var objFile = fileUploadControl.files[0];
		var objReader = new FileReader();

		objReader.onload = function(e) {
			$('.image-detail').attr('src', e.target.result);
		}

		objReader.readAsDataURL(objFile);
	},

	update: function() {
		this.model.set({
			comment: 	this.$el.find('.form-comment').val()
		}).save();

		this.remove();
		this.reset();
	},

	destroy: function() {
		this.model.destroy();
		this.remove();
		this.reset();
	}
});