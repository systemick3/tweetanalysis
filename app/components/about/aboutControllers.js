var app = angular.module('twitterapp');

app.controller('aboutCtrl', ['$scope', '$window', function ($scope, $window) {

  $scope.showAbout = false;

  $scope.toggleAbout = function() {
    alert('Hello');
    $window.scrollTo(0, 0);
    $scope.showAbout = !$scope.showAbout;
  };

}]);