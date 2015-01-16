var app = angular.module("twitterapp")

app.factory('userFactory', ['$http', '$window', 'tConfig', function ($http, $window, tConfig) {
  var loginUrl = tConfig.apiData.server + tConfig.apiData.loginUrl,
    testUrl = tConfig.apiData.server + tConfig.apiData.testUrl,
    sessionUrl = tConfig.apiData.server + tConfig.apiData.userSessionUrl,
    userUrl = tConfig.apiData.server + tConfig.apiData.userDataUrl,
    userObject = {},
    userSessionPromise;

  return {

    sendLoginData: function (loginData) {
      return $http.post(loginUrl, loginData);
    },

    userSessionData: function () {
      if (!userSessionPromise) {
        userSessionPromise = $http.get(sessionUrl).then(function (response) {
          return response;
        });
      }
      return userSessionPromise;
    },

    userTwitterData: function (user_id) {
      return $http.get(userUrl +'/' + user_id);
    }

  };

}]);

app.factory('authInterceptor', ['$rootScope', '$q', '$window', '$location', function ($rootScope, $q, $window, $location) {
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