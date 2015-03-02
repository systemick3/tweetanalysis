angular.module("twitterapp")

  /* Not currently used - login is via Twitter only */
  // login: handle the submission of the site login form
  // send login data to API
  // set the session token that will be used in a ll further requests 
  .controller('loginCtrl', ['$scope', '$window', '$rootScope', 'ipCookie', 'userFactory', 'tConfig', function ($scope, $window, $rootScope, ipCookie, userFactory, tConfig) {
    $scope.formSuccess = false;
    $scope.formSubmitError = false;
    $scope.twitterLoginUrl = tConfig.apiData.server + tConfig.apiData.twitterLoginUrl;
    $scope.doLogin = function (loginDetails) {

      if (angular.isDefined(loginDetails.username) && angular.isDefined(loginDetails.password)) {

        userFactory.sendLoginData(loginDetails)
          .success(function (data) {
            $window.sessionStorage.token = data.token;
            $rootScope.tweetapp = {};
            $rootScope.tweetapp.authorised = true;
            ipCookie(tConfig.sessionCookieName, $window.sessionStorage.token, { expires: 365 });
            $scope.formSuccess = true;
          })
          .error(function (error) {
            delete $window.sessionStorage.token;
            $scope.formSubmitError = "Invalid username or password";
          });
      }
    };
  }])

  // loginCallback: handle the twitter callback
  // set the session token that will be used in all further requests
  // redirect to error page if twitter login unsuccessful
  .controller('loginCallbackCtrl', ['$location', '$window', '$rootScope', '$routeParams', 'ipCookie', 'tConfig', function ($location, $window, $rootScope, $routeParams, ipCookie, tConfig) {
    if (!angular.isDefined($routeParams.id)) {
      $rootScope.tweetapp = {};
      $rootScope.tweetapp.authorised = false;
      $location.path('/error');
    } else {
      $window.sessionStorage.token = $routeParams.id;
      $rootScope.tweetapp = {};
      $rootScope.tweetapp.authorised = true;
      ipCookie(tConfig.sessionCookieName, $routeParams.id, { expires: 365 });
      $location.path('/home');
    }

  }])

  // logout: unset the session token and redirect back to login
  .controller('logoutCtrl', ['$window', '$location', '$rootScope', 'ipCookie', 'tConfig', function ($window, $location, $rootScope, ipCookie, tConfig) {

    delete $window.sessionStorage.token;
    delete $window.sessionStorage.screen_name;
    delete $window.sessionStorage.user_id;
    delete $rootScope.tweetapp;
    ipCookie.remove(tConfig.sessionCookieName);
    $location.path('/home');

  }]);