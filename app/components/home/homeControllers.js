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

    // Get the user analysis
    homeFactory.getUserAnalysis(userId)
      .success(function (data) {
        console.log(data);
        $scope.userAnalysis = data;

        // Get the number of mentions
        homeFactory.getUserMentions(userId)
          .success(function (mentions) {
            $scope.userAnalysis.analysis.seven.mentions = mentions.mentions.seven;
            $scope.userAnalysis.analysis.thirty.mentions = mentions.mentions.thirty;
            $scope.userAnalysis.analysis.ninety.mentions = mentions.mentions.ninety;
          })
          .error(function (err) {
            console.log(err);
          });

      })
      .error(function (err) {
        console.log(err);
      });
  });
}]);
