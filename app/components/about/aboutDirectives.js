var app = angular.module("twitterapp");

app.directive('aboutModal', ['contactFactory', 'userFactory', function (contactFactory, userFactory) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: "components/about/views/about.html"
  };
}]);