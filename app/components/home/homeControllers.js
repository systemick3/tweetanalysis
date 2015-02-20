var app = angular.module('twitterapp');

app.controller('homeCtrl', ['$scope', '$window', '$rootScope', 'ipCookie', 'userFactory', 'homeFactory', 'tConfig', function ($scope, $window, $rootScope, ipCookie, userFactory, homeFactory, tConfig) {

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
      $scope.tweets_for = $scope.user.screen_name;

      // Get the full user data from Twitter
      userFactory.userTwitterData(data.data.user_id)
        .success(function (data) {
          var mongo_id = $scope.user._id;
          $scope.user = data;
          $rootScope.user = $scope.user;
          $scope.user._id = mongo_id;
          console.log($scope.user);

          $scope.showModal = false;

          $scope.toggleModal = function() {
            $scope.showModal = !$scope.showModal;
          };

        })
        .error(function (err) {
          $scope.twitterDataError = 'Unable to retrieve data from Twitter. Please try again later.';
        });

    }, function (err) {
      $scope.loginError = 'Unable to log in. There is possibly a problem with Twitter. Please try again later.';
    });

  };

}]);

app.controller('streamCtrl', ['$scope', 'socket', 'homeFactory', function ($scope, socket, homeFactory) {
  var oldTweets = [];
  $scope.streamtweets = [];

  socket.on('tweets', function (data) {
    // Display a maximum of 12 tweets
    if ($scope.streamtweets.length >= 12) {
      // If we already have 12 tweets lose the oldest
      $scope.streamtweets.pop();
      oldTweets = $scope.streamtweets;
    }
    else {
      oldTweets = $scope.streamtweets;
    }
    // Make the new tweet the 1st item in the array
    $scope.streamtweets = homeFactory.processTweets(data.concat(oldTweets));
  });

  $scope.$on('socket:error', function (ev, data) {
    $scope.streamError = 'Unable to stream latest tweets from Twitter. Please try again later.'
  });

  homeFactory.getTrends()
    .success(function (data) {
      $scope.trends = data.data[0].trends;
    })
    .error(function (err) {
      $scope.trendsError = 'Unable to get latest trends from Twitter. Please try again later.';
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
    });
  }, function (err) {
    $scope.analysisError = 'Unable to download analysis data. Please try again later';
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
        })
        .error(function (err) {
          $scope.moreTweetsError = 'Unable to download more tweets. Please try again later.';
        });
    };

  });

}]);

app.controller('headerCtrl', ['$scope', '$window', '$location', function($scope, $window, $location) {

}]);

app.controller('errorCtrl', ['$scope', '$window', '$location', function($scope, $window, $location) {

}]);

// default - handle any requests not for an authorised URL
app.controller('defaultCtrl', ['$scope', '$window', '$location', function($scope, $window, $location) {
  $location.path('/home');
}]);