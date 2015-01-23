var app = angular.module('twitterapp');

app.controller('homeCtrl', ['$scope', '$window', '$rootScope', 'ipCookie', 'userFactory', 'tConfig', function ($scope, $window, $rootScope, ipCookie, userFactory, tConfig) {

  var userId;

  // If the user refreshes a page retrieve the token from sessionStorage
  if (angular.isDefined($window.sessionStorage.token) && (!angular.isDefined($rootScope.tweetapp) || $rootScope.tweetapp.authorised == false)) {
    $rootScope.tweetapp = {};
    $rootScope.tweetapp.authorised = true;
    ipCookie(tConfig.sessionCookieName, $window.sessionStorage.token, { expires:365 });
  }
  // If sessionStorage isn't available try the cookie
  else {
    token = ipCookie(tConfig.sessionCookieName);
    if (angular.isDefined(token) && (!angular.isDefined($rootScope.tweetapp) || $rootScope.tweetapp.authorised == false)) {
      $window.sessionStorage.token = token;
      $rootScope.tweetapp = {};
      $rootScope.tweetapp.authorised = true;
    }
  }

  // Fetch the session data from the API
  if (angular.isDefined($rootScope.tweetapp) && $rootScope.tweetapp.authorised) {

    userFactory.userSessionData().then(function (data) {

      $window.sessionStorage.user_id = data.data.user_id;
      $window.sessionStorage.screen_name = data.data.screen_name;
      $scope.user = data.data;
      $scope.tweetapp.user = data.data;
      userId = data.data.user_id;
      $rootScope.user = $scope.user;
      $scope.tweets_for = 'user ' + $scope.user.screen_name;

      // Get the full user data from Twitter
      userFactory.userTwitterData(data.data.user_id)
        .success(function (data) {
          var mongo_id = $scope.user._id;
          $scope.user = data;
          $scope.user._id = mongo_id;
          console.log($scope.user);
        });

    });

  };

}]);

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
    $scope.streamtweets = homeFactory.processTweets(data.concat(oldTweets));
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

app.controller('userTweetsCtrl', ['$scope', 'userFactory', 'homeFactory', 'tConfig', function ($scope, userFactory, homeFactory, tConfig) {
  var userId;
  userFactory.userSessionData().then(function (data) {
    $scope.usertweets = null;
    $scope.tweetsLoaded = false;
    $scope.allTweetsLoaded = false;
    homeFactory.getUserTweets($scope.user)
      .success(function (data) {
        $scope.tweetsLoaded = true;
        $scope.usertweets = homeFactory.processTweets(data);
      })
      .error(function (error) {
        $scope.status = 'Unable to load tweets for user: ' + error.message;
      });

    ////////////////// Functions used by the home page /////////////////////////

    // Add more tweets to the end of the list
    $scope.getMoreTweets = function () {
      $scope.tweetsLoaded = false;
      var maxId = $scope.usertweets[$scope.usertweets.length - 1].id_str;
      homeFactory.getUserTweets($scope.user, maxId)
        .success(function (data) {
          var newTweets = homeFactory.processTweets(data.slice(1));
          $scope.usertweets = $scope.usertweets.concat(newTweets);
          $scope.tweetsLoaded = true;

          if (newTweets.length < tConfig.numUserTweets) {
            $scope.allTweetsLoaded = true;
          }
        });
    };

    // Show all the retweeters of a tweet
    $scope.showRetweeters = function (tweetId) {
      var selectedTweet;
      for (var i=0; i<$scope.usertweets.length; i++) {
        if ($scope.usertweets[i].id_str == tweetId) {
          selectedTweet = $scope.usertweets[i];
          break;
        }
      }

      // If already loaded just show
      if (selectedTweet.retweeters) {
        selectedTweet.show_retweeters = true;
      }
      // Fetch from server
      else {

        homeFactory.getRetweeters(tweetId)
          .success(function (data) {
            selectedTweet.retweeters = data.retweeters;
            selectedTweet.reach = data.reach;
            selectedTweet.show_retweeters = true;
          })
          .error(function (err) {
            console.log(err);
          });
      }

    };

    // Hide the retweeters info
    $scope.hideRetweeters = function (tweetId) {
      for (var i=0; i<$scope.usertweets.length; i++) {
        if ($scope.usertweets[i].id_str == tweetId) {
          $scope.usertweets[i].show_retweeters = false;
          break;
        }
      }
    };

    // Show the replies to this tweets
    $scope.showReplies = function(tweetId) {
      var selectedTweet;

      for (var i=0; i<$scope.usertweets.length; i++) {
        if ($scope.usertweets[i].id_str == tweetId) {
          selectedTweet = $scope.usertweets[i];
          break;
        }
      }
      if (selectedTweet.replies) {
        selectedTweet.show_replies = true;
      }
      else {

        homeFactory.getReplies(userId, tweetId)
          .success(function (data) {
            selectedTweet.replies = homeFactory.processTweets(data.replies);
            selectedTweet.show_replies = true;
          })
          .error(function (err) {
            console.log(err);
          });
      }

    };

    // Hide the replies
    $scope.hideReplies = function (tweetId) {
      for (var i=0; i<$scope.usertweets.length; i++) {
        if ($scope.usertweets[i].id_str == tweetId) {
          $scope.usertweets[i].show_replies = false;
          break;
        }
      }
    };

  });

}]);

app.controller('errorCtrl', ['$scope', '$window', '$location', function($scope, $window, $location) {
    
}]);

// default - handle any requests not for an authorised URL
app.controller('defaultCtrl', ['$scope', '$window', '$location', function($scope, $window, $location) {
  $location.path('/home');
}]);