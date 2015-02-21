var app = angular.module("twitterapp");

app.directive('contactModal', ['contactFactory', 'userFactory', function (contactFactory, userFactory) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: "components/contact/views/contact.html"
  };
}]);