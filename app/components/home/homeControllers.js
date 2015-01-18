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
