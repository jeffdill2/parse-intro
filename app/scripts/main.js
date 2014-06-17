'use strict';

////////////////////////////////////////////////////////////
////////////////////////////////////////////// SETTING UP UI
////////////////////////////////////////////////////////////
$(window).resize(function() {
	$('.header').css('border-left-width', $(window).width());
	$('.header').css('border-top-width', $(window).width() * 0.156666);
});

Parse.initialize("TJwmttIazJ3YEVm0bEW5KdReglYz0ViHpygK8y40", "9rTc1AIV0UHOIbaM8TMZBngR0H8ZzI6DOOzTXgwo");

var Animal = Parse.Object.extend({
	className: "Animal",
});

var doggy = new Animal();

// doggy.save({
// 	name: "Bones",
// 	test: {array: [1,2,3]}
// }, {
// 	success: function() {
// 		console.log('HUZZAH!');
// 	},
// 	error: function() {
// 		console.log('OOPS!');
// 	}
// });

var animalQuery = new Parse.Query(Animal);

animalQuery.get('AagWh9YUMV', {
	success: function(animal) {
		console.log('animal is',animal);
	},
	error: function(object, error) {
		console.log('OOPS!');
	}
});


document.getElementById("uploadBtn").onchange = function () {
    document.getElementById("uploadFile").value = this.value;
};