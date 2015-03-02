var app = angular.module("twitterapp");

app.factory('analysisFactory', ['$http', 'tConfig', function ($http, tConfig) {
  var userAnalysisPromise,
    apiData = tConfig.apiData;

  return {
    getUserAnalysis: function (userId) {
      var userAnalysisUrl = apiData.server + apiData.userAnalysis.url + '/' + userId;

      if (!userAnalysisPromise) {
        userAnalysisPromise = $http.get(userAnalysisUrl).then(function (response) {
          return response;
        });
      }
      return userAnalysisPromise;
    }
  };

}]);