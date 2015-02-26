var app = angular.module("twitterapp");

app.controller('userAnalysisCtrl', ['$scope', 'userFactory', 'analysisFactory', function ($scope, userFactory, analysisFactory) {
  var userId;

  userFactory.userSessionData().then(function (response) {
    if (response.data.data) {
      userId = $scope.user.user_id;

      analysisFactory.getUserAnalysis(userId).then(function (data) {
        $scope.userAnalysis = data.data;
      });
    }
  }, function (err) {
    $scope.analysisError = 'Unable to download analysis data. Please try again later';
  });
}]);