var app = angular.module('twitterapp');

app.controller('tweetCtrl', ['$scope', 'userFactory', 'tweetFactory', 'tConfig', function ($scope, userFactory, tweetFactory, tConfig) {

  userFactory.userSessionData().then(function (response) {
    if (response.data.data) {
      $scope.usertweets = null;
      $scope.tweetsLoaded = false;
      $scope.allTweetsLoaded = false;
      tweetFactory.getUserTweets($scope.user)
        .success(function (data) {
          $scope.tweetsLoaded = true;
          $scope.usertweets = tweetFactory.processTweets(data);
        })
        .error(function (error) {
          $scope.status = 'Unable to load tweets for user: ' + error.message;
        });

      ////////////////// Functions used by the home page /////////////////////////

      // Add more tweets to the end of the list
      $scope.getMoreTweets = function () {
        $scope.tweetsLoaded = false;
        var maxId = $scope.usertweets[$scope.usertweets.length - 1].id_str;
        tweetFactory.getUserTweets($scope.user, maxId)
          .success(function (data) {
            var newTweets = tweetFactory.processTweets(data.slice(1));
            $scope.usertweets = $scope.usertweets.concat(newTweets);
            $scope.tweetsLoaded = true;

            if (newTweets.length < tConfig.numUserTweets) {
              $scope.allTweetsLoaded = true;
            }
          })
          .error(function (err) {
            $scope.moreTweetsError = 'Unable to download more tweets. Please try again later.';
          });
      };
    }

  });

}]);