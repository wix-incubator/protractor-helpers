var app = angular.module('protractorTest', []);

app.controller('MainCtrl', function ($scope, $timeout) {
	this.tools = ['angular', 'node', 'grunt', 'yeoman'];
	this.immediate = {'visibility': 'hidden'};
	this.delayed = {'visibility': 'hidden'};
	this.email = '';
	this.name = 0;

	this.hoverTrigger = function (isHovered) {
		var self = this;
		var newVisibility = isHovered ? {'visibility': 'visible'} : {'visibility': 'hidden'};
		this.immediate = newVisibility;
		$timeout(function () {
			self.delayed = newVisibility;
		}, 500);
	};
});

app.service('$translate', function () {
	var $translate = function (translationId, interpolateParams) {
		return translationId + '-tranlated-' + interpolateParams
	};
	return $translate;
});
app.filter('translate', function ($translate) {
	var translateFilter = function (translationId, interpolateParams) {
		return $translate(translationId, interpolateParams);
	};
	return translateFilter;
});
