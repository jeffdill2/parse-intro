'use strict';

////////////////////////////////////////////////////////////
//////////////////////////////////// DETAIL VIEW CONSTRUCTOR
////////////////////////////////////////////////////////////
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
		var objParseFile = this.parseFile();

		$('.loading').show();

		var image = new Image();

		image.save({
			image: 			objParseFile,
			comment: 		$('.form-comment').val(),
			isPlaceholder: 	false
		}, {
			success: function() {
				$('.loading').hide();

				new ThumbnailView({model: image});
			},
			error: function() {
				console.log('There was an issue with saving the image!');
			}
		});

		this.remove();
		this.reset();
	},

	update: function() {
		var objParseFile = this.parseFile();
		if (!objParseFile) return;

		$('.loading').show();

		// If the image is unchanged, only the comment will be updated on the server, otherwise the image and comment will be updated.
		if (objParseFile === 'unchanged') {
			this.model.set({
				comment: this.$el.find('.form-comment').val()
			}).save({
				success: function() {
					$('.loading').hide();
				},
				error: function() {
					console.log('There was an issue with updating the comment!');
				}
			});
		} else {
			this.fileUploadPromise.done(function(){
				this.model.set({
					image: 		objParseFile,
					comment: 	this.$el.find('.form-comment').val()
				}).save({
					success: function() {
						$('.loading').hide();
					},
					error: function() {
						console.log('There was an issue with updating the image!');
					}
				});
			}.bind(this));
		}

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

	parseFile: function() {
		// ------------------------------------------------------------
		// LOGIC:
		// 1. If the image-file-selector element has content, the value will be pulled and used as the file.
		// 2. If the image-file-selector element has no content, but the image-file-name element does have content, the value will be unchanged because an image already exists on the server.
		// 3. Neither has content, so throw an alert.
		// ------------------------------------------------------------

		var fileUploadControl = $(".image-file-selector")[0];

		if (fileUploadControl.files.length > 0) {
			var objFile = fileUploadControl.files[0];
			var strFilename = $('.image-file-selector').val().split('\\').pop().split('/').pop();

			var objParseFile = new Parse.File(strFilename, objFile);
			this.fileUploadPromise = objParseFile.save();

			return objParseFile;
		} else if (!($('.image-file-name').val() === '')) {
			return 'unchanged';
		} else {
			alert('You must select a file to upload!');
			return false;
		}
	},

	destroy: function() {
		this.model.destroy();
		this.remove();
		this.reset();
	}
});