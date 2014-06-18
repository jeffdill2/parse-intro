'use strict';

Parse.initialize("TJwmttIazJ3YEVm0bEW5KdReglYz0ViHpygK8y40", "9rTc1AIV0UHOIbaM8TMZBngR0H8ZzI6DOOzTXgwo");

var Image = Parse.Object.extend({
	className: "Image"
});

var ImageCollection = Parse.Collection.extend({
	model: Image
});