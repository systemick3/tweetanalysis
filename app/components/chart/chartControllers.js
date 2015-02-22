var app = angular.module('twitterapp');

app.controller('chartCtrl', ['$scope', '$window', '$rootScope', function ($scope, $window, $rootScope) {

  $rootScope.showChart = false;

  $rootScope.toggleChart = function() {
    $window.scrollTo(0, 0);
    $rootScope.showChart = !$rootScope.showChart;
  };

}]);