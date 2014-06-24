'use strict';

////////////////////////////////////////////////////////////
//////////////////////////////////// DETAIL VIEW CONSTRUCTOR
////////////////////////////////////////////////////////////
var DetailView = Parse.View.extend({
	className: 'detail',

	detailTemplate: _.template($('.detail-template').text()),

	events: {
		"click .select-button"	: "select",
		"click .filter-button"	: "filter",
		"click .upload-button" 	: "upload",
		"click .cancel-button"	: "reset",
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
		this.remove();
		new DetailView({model: placeholderModel});
	},

	select: function() {
		$('.image-file-selector').click();
	},

	filter: function() {
		$('.image-filter-overlay').fadeIn('slow');
		$('.image-filter-options').fadeIn('slow');

		$('.radio-button').click(function() {
			$('.image-filter-options').fadeOut('slow');
			$('.image-filter-overlay').fadeOut('slow');

			$('.image-detail').hide();
			$('.detail').prepend('<canvas id="canvas" width="' + $('.image-detail').width() + '" height="' + $('.image-detail').height() + '"></canvas>');

			var objFileReader = new FileReader();
			var objImageFile = $('.image-file-selector')[0].files[0];

			objFileReader.onload = function(file) {
				var objCanvas = new fabric.Canvas('canvas');
				var strFilterType = $('input:radio[name=filter-type]:checked').val();
				var strFileURL = file.target.result;

				fabric.Image.fromURL(strFileURL, function(image) {
					switch (strFilterType) {
						case 'grayscale':
							image.filters.push(new fabric.Image.filters.Grayscale());
							break;

						case 'invert':
							image.filters.push(new fabric.Image.filters.Invert());
							break;

						case 'sepia':
							image.filters.push(new fabric.Image.filters.Sepia());
							break;

						case 'none':
							image.filters.push([]);
							break;

						default:
							break;
					}

					image.setHeight($('.image-detail').height());
					image.setWidth($('.image-detail').width());

					image.applyFilters(objCanvas.renderAll.bind(objCanvas));
					objCanvas.add(image).setActiveObject(image).renderAll();
				});
			};

			if (objImageFile) {
				objFileReader.readAsDataURL(objImageFile);
			} else {
				console.log('NON-LOCAL FILE NOT READY YET!');
			}
		});
	},

	upload: function() {
		var objParseFile = this.parseFile();
		if (!objParseFile) return;

		$('.loading').show();

		var image = new Image();

		image.save({
			image: objParseFile,
			comment: $('.image-comment').val(),
			isPlaceholder: false
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
				comment: this.$el.find('.image-comment').val()
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
					image: objParseFile,
					comment: this.$el.find('.image-comment').val()
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
		this.reset();
	}
});