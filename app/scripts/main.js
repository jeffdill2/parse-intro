'use strict';

////////////////////////////////////////////////////////////
//////////////////////////////// INSTANTIATING INITIAL NEEDS
////////////////////////////////////////////////////////////
var imageCollection = new ImageCollection();
var placeholderModel = new Image({image: {_url: '../images/placeholder-image.png'}, comment: '', isPlaceholder: true});
new DetailView({model: placeholderModel});

////////////////////////////////////////////////////////////
////////////////////////////////// LOADING IMAGES FROM PARSE
////////////////////////////////////////////////////////////
loadImages();

function loadImages() {
	imageCollection.fetch({change: true}).done(function() {
		imageCollection.each(function(image) {
			new ThumbnailView({model: image});
		});
	});
}

////////////////////////////////////////////////////////////
//////////////////////////////////////////// EVENT FUNCTIONS
////////////////////////////////////////////////////////////
$(document).on('change', '.image-file-selector', displayImage);

function displayImage() {
	$('.image-file-name').val($('.image-file-selector').val());

	var fileUploadControl = $(".image-file-selector")[0];
	var objFile = fileUploadControl.files[0];
	var objReader = new FileReader();

	objReader.onload = function(e) {
		$('.image-detail').attr('src', e.target.result);
	}

	objReader.readAsDataURL(objFile);
}