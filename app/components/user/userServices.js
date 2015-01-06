angular.module("twitterapp")

  .factory('userFactory', ['$http', '$window', 'tConfig', function ($http, $window, tConfig) {
    var loginUrl = tConfig.apiData.server + tConfig.apiData.loginUrl;
    var testUrl = tConfig.apiData.server + tConfig.apiData.testUrl;
    var sessionUrl = tConfig.apiData.server + tConfig.apiData.userSessionUrl;
    var userUrl = tConfig.apiData.server + tConfig.apiData.userDataUrl;
    var userObject = {};

    userObject.sendLoginData = function (loginData) {
      return $http.post(loginUrl, loginData);
    };

    userObject.testData = function () {
      return $http.get(testUrl);
    };

    userObject.userSessionData = function () {
      return $http.get(sessionUrl);
    };

    userObject.userTwitterData = function (user_id) {
      return $http.get(userUrl +'/' + user_id);
    };

    return userObject;
  }])

  .factory('authInterceptor', ['$rootScope', '$q', '$window', '$location', function ($rootScope, $q, $window, $location) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        }
        return config;
      },
      response: function (response) {
        if (response.status === 401) {
          // handle the case where the user is not authenticated
          $location.path('/error')
        }
        return response || $q.when(response);
      }
    };
  }]);