var app = angular.module('twitterapp');

app.controller('chartCtrl', ['$scope', '$window', '$rootScope', function ($scope, $window, $rootScope) {

  $rootScope.showAnalysisChart = false;
  $rootScope.showFollowersChart = false;

  $rootScope.toggleAnalysisChart = function() {
    $window.scrollTo(0, 0);
    $rootScope.showAnalysisChart = !$rootScope.showAnalysisChart;
  };

  $rootScope.toggleFollowersChart = function() {
    $window.scrollTo(0, 0);
    $rootScope.showFollowersChart = !$rootScope.showFollowersChart;
  };

}]);