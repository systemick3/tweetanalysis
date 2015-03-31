var app = angular.module('twitterapp');

app.controller('aboutCtrl', ['$rootScope', '$window', function ($rootScope, $window) {

  $rootScope.showAbout = false;

  $rootScope.toggleAbout = function () {
    $window.scrollTo(0, 0);
    $rootScope.showAbout = !$rootScope.showAbout;
    $rootScope.menuVisible = false;
  };

}]);