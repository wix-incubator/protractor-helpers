var app = angular.module('protractorTest', []);

app.controller('MainCtrl', function($scope, $timeout) {
  var self = this;
  $scope.name = 'World';
  self.immediate = {'visibility': 'hidden'};
  self.delayed = {'visibility': 'hidden'};

  this.hoverTrigger = function (isHovered) {
    var newVisibility = isHovered ? {'visibility': 'visible'} : {'visibility': 'hidden'};
    self.immediate = newVisibility;
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