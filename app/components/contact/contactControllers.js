var app = angular.module('twitterapp');

app.controller('contactCtrl', ['$scope', '$rootScope', '$window', 'contactFactory', function ($scope, $rootScope, $window, contactFactory) {

  $scope.formSuccess = false;
  $scope.forSubmitError = false;
  $scope.origin = location.hostname;
  $scope.sendContactEmail = function (contactDetails) {
    contactDetails.origin = location.hostname;
    if (angular.isDefined(contactDetails.name) && angular.isDefined(contactDetails.email) && angular.isDefined(contactDetails.subject)
        && angular.isDefined(contactDetails.message)) {

      console.log(contactDetails);

      contactFactory.sendContactData(contactDetails)
        .success(function (data) {
          $scope.formSuccess = true;
        })
        .error(function (error) {
          $scope.formSubmitError = true;
        });
    }
  };

  $rootScope.showContact = false;

  $rootScope.toggleContact = function () {
    $window.scrollTo(0, 0);
    $rootScope.showContact = !$rootScope.showContact;
    $rootScope.menuVisible = false;
  };

}]);