var app = angular.module('twitterapp');

app.controller('aboutCtrl', ['$scope', '$rootScope', '$window', function ($scope, $rootScope, $window) {

  $rootScope.showAbout = false;

  $rootScope.toggleAbout = function() {
    $window.scrollTo(0, 0);
    $rootScope.showAbout = !$rootScope.showAbout;
  };

}]);