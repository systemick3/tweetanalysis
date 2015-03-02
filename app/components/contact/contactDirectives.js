var app = angular.module("twitterapp");

app.directive('contactModal', [function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: "components/contact/views/contact.html"
  };
}]);