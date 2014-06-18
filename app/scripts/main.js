'use strict';

var imageCollection = new ImageCollection();
var placeholderModel = new Image({image: {_url: '../images/placeholder-image.png'}, comment: '', isPlaceholder: true});

new DetailView({model: placeholderModel});

loadImages();

function loadImages() {
	imageCollection.fetch().done(function() {
		imageCollection.models.reverse();

		imageCollection.each(function(image) {
			new ThumbnailView({model: image});
		});
	});
}

$('.image-file-selector-button').click(function() {
	var numTimesRun = 0;

	var updateImageName = function() {
		numTimesRun += 1;

		if ($('.image-file-name').val() !== "" || numTimesRun === 600000) {
			clearInterval(interval);
		}

		$('.image-file-name').val($('.image-file-selector').val());
	};

	$('.image-file-selector').click();

	var interval = setInterval(updateImageName, 1);
});