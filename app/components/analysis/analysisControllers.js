var app = angular.module("twitterapp");

app.controller('userAnalysisCtrl', ['$scope', 'analysisFactory', '$window', function ($scope, analysisFactory, $window) {
  var userId;

  if ($window.sessionStorage.user_id) {
    userId = $scope.user.user_id;

    analysisFactory.getUserAnalysis(userId).then(function (data) {
      $scope.userAnalysis = data.data;
    }, function (err) {
      $scope.analysisError = 'Unable to download analysis data. Please try again later';
    });
  }
}]);