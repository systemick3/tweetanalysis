var app = angular.module('twitterapp');

app.controller('homeCtrl', ['$scope', '$window', '$rootScope', 'ipCookie', 'userFactory', 'tConfig', '$sce', '$location', function ($scope, $window, $rootScope, ipCookie, userFactory, tConfig, $sce, $location) {

  var token;

  $scope.currentYear = new Date().getFullYear();

  $rootScope.bodyClass = 'login';

  $rootScope.menuVisible = false;

  $rootScope.serverUrl = $sce.trustAsResourceUrl(tConfig.apiData.server + tConfig.apiData.twitterLoginUrl);

  $rootScope.siteUrl = $sce.trustAsResourceUrl(tConfig.apiData.siteUrl);

  $rootScope.toggleMenu = function () {
    $rootScope.menuVisible = !$rootScope.menuVisible;
  };

  $rootScope.hideAll = function () {
    $rootScope.showContact = false;
    $('#page .left').removeClass('hidden-xs');
    $('#page .right').addClass('hidden-xs');
    $rootScope.menuText = 'Your data';
    $rootScope.showAbout = false;
    $rootScope.menuVisible = false;
  };

  // If the user refreshes a page retrieve the token from sessionStorage
  if (angular.isDefined($window.sessionStorage.token) && (!angular.isDefined($rootScope.tweetapp) || $rootScope.tweetapp.authorised === false)) {
    $rootScope.tweetapp = {};
    $rootScope.tweetapp.authorised = true;
    ipCookie(tConfig.sessionCookieName, $window.sessionStorage.token, { expires: 365 });
  } else {
    // If sessionStorage isn't available try the cookie
    token = ipCookie(tConfig.sessionCookieName);
    if (angular.isDefined(token) && (!angular.isDefined($rootScope.tweetapp) || $rootScope.tweetapp.authorised === false)) {
      $window.sessionStorage.token = token;
      $rootScope.tweetapp = {};
      $rootScope.tweetapp.authorised = true;
    }
  }

  // Fetch the session data from the API
  if (angular.isDefined($rootScope.tweetapp) && $rootScope.tweetapp.authorised) {

    userFactory.userSessionData().then(function (promise) {

      if (promise.data.data) {
        var data = promise.data;
        $window.sessionStorage.user_id = data.data.user_id;
        $window.sessionStorage.screen_name = data.data.screen_name;
        $scope.user = data.data;
        $scope.tweetapp.user = data.data;
        userId = data.data.user_id;
        $rootScope.user = $scope.user;
        $scope.tweets_for = $scope.user.screen_name;
        $rootScope.bodyClass = 'home';

        $rootScope.menuText = 'Your data';
        $rootScope.toggleAnalysis = function () {
          $rootScope.menuVisible = false;
          $('#page .left').toggleClass('hidden-xs');
          $('#page .right').toggleClass('hidden-xs');

          if ($('#page .left').hasClass('hidden-xs')) {
            $rootScope.menuText = 'Your tweets';
          } else {
            $rootScope.menuText = 'Your data';
          }
          $rootScope.menuVisible = false;
        };

        userFactory.userTwitterData(data.data.user_id).then(function (response) {
          if (response.status == '200') {
            var mongo_id = $scope.user._id;
            $scope.user = response.data;
            $rootScope.user = $scope.user;
            $scope.user._id = mongo_id;
            $rootScope.$broadcast('tweetAppAuthorised');
          } else {
            alert('1');
            $rootScope.logoutMsg = 'You have been logged out due to inactivity. Please login again.';
            $location.path('/logout');
          }
        }, function (err) {
          $rootScope.logoutMsg = 'You have been logged out due to inactivity. Please login again.';
          $location.path('/logout');
        });

      }

    }, function (err) {
      $rootScope.logoutMsg = 'Unable to retrieve data from Twitter. Please try again later.';
      $location.path('/logout');
    });

  }

}]);

app.controller('headerCtrl', ['$scope', '$window', '$location', function ($scope, $window, $location) {

}]);

app.controller('errorCtrl', ['$scope', '$window', '$location', function ($scope, $window, $location) {

}]);

// default - handle any requests not for an authorised URL
app.controller('defaultCtrl', ['$scope', '$window', '$location', function ($scope, $window, $location) {
  $location.path('/home');
}]);