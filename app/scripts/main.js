'use strict';

var imageCollection = new ImageCollection();
var placeholderModel = new Image({image: {_url: '../images/placeholder-image.png'}, comment: '', isPlaceholder: true});

new DetailView({model: placeholderModel});

loadImages();

function loadImages() {
	imageCollection.fetch({change: true}).done(function() {
		imageCollection.each(function(image) {
			new ThumbnailView({model: image});
		});
	});
}

$(document).on('change', '.image-file-selector', function() {
	$('.image-file-name').val($('.image-file-selector').val());
});

$(document).on('click', '.image-file-selector-button', function() {
	$('.image-file-selector').click();
});