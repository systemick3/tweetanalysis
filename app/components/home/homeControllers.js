var app = angular.module('twitterapp');

app.controller('streamCtrl', ['$scope', 'socket', 'homeFactory', function ($scope, socket, homeFactory) {
  var oldTweets = [];
  $scope.streamtweets = [];

  socket.on('tweets', function (data) {
    if ($scope.streamtweets.length >= 12) {
      $scope.streamtweets.pop();
      oldTweets = $scope.streamtweets;
    }
    else {
      oldTweets = $scope.streamtweets;
    }
    $scope.streamtweets = processTweets(data.concat(oldTweets));
  });

  homeFactory.getTrends()
    .success(function (data) {
      $scope.trends = data.data[0].trends;
    })
    .error(function (err) {
      console.log(err);
    });

  $scope.selectTrends = function (trend) {
    return trend.name.length <= 30;
  };

}]);

app.controller('userAnalysisCtrl', ['$scope', 'userFactory', 'homeFactory', function ($scope, userFactory, homeFactory) {
  var userId;

  userFactory.userSessionData().then(function (data) {
    userId = $scope.user.user_id;

    homeFactory.getUserAnalysis(userId).then(function (data) {
      var test;
      $scope.userAnalysis = data.data;

      homeFactory.getUserMentions(userId).then(function (mentionsData) {
        $scope.userAnalysis.analysis.seven.mentionCount = mentionsData.data.mentions.seven;
        $scope.userAnalysis.analysis.thirty.mentionCount = mentionsData.data.mentions.thirty;
        $scope.userAnalysis.analysis.ninety.mentionCount = mentionsData.data.mentions.ninety;
        console.log($scope.userAnalysis.analysis);
      });
    });
  });
}]);
