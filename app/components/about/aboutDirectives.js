var app = angular.module("twitterapp");

app.directive('aboutModal', [function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: "components/about/views/about.html"
  };
}]);