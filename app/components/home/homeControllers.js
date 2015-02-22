var app = angular.module('twitterapp');

app.controller('homeCtrl', ['$scope', '$window', '$rootScope', 'ipCookie', 'userFactory', 'tConfig', function ($scope, $window, $rootScope, ipCookie, userFactory, tConfig) {

  var userId;

  $scope.currentYear = new Date().getFullYear();

  $rootScope.bodyClass = 'login';

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
      $rootScope.bodyClass = 'home';

      // Get the full user data from Twitter
      userFactory.userTwitterData(data.data.user_id)
        .success(function (data) {
          var mongo_id = $scope.user._id;
          $scope.user = data;
          $rootScope.user = $scope.user;
          $scope.user._id = mongo_id;
        })
        .error(function (err) {
          $scope.twitterDataError = 'Unable to retrieve data from Twitter. Please try again later.';
        });

    }, function (err) {
      $scope.loginError = 'Unable to log in. There is possibly a problem with Twitter. Please try again later.';
    });

  };

}]);

// app.controller('streamCtrl', ['$scope', 'socket', 'homeFactory', function ($scope, socket, homeFactory) {
//   var oldTweets = [];
//   $scope.streamtweets = [];

//   socket.on('tweets', function (data) {
//     // Display a maximum of 12 tweets
//     if ($scope.streamtweets.length >= 12) {
//       // If we already have 12 tweets lose the oldest
//       $scope.streamtweets.pop();
//       oldTweets = $scope.streamtweets;
//     }
//     else {
//       oldTweets = $scope.streamtweets;
//     }
//     // Make the new tweet the 1st item in the array
//     $scope.streamtweets = homeFactory.processTweets(data.concat(oldTweets));
//   });

//   $scope.$on('socket:error', function (ev, data) {
//     $scope.streamError = 'Unable to stream latest tweets from Twitter. Please try again later.'
//   });

//   homeFactory.getTrends()
//     .success(function (data) {
//       $scope.trends = data.data[0].trends;
//     })
//     .error(function (err) {
//       $scope.trendsError = 'Unable to get latest trends from Twitter. Please try again later.';
//     });

//   $scope.selectTrends = function (trend) {
//     return trend.name.length <= 30;
//   };

// }]);

app.controller('headerCtrl', ['$scope', '$window', '$location', function($scope, $window, $location) {

}]);

app.controller('errorCtrl', ['$scope', '$window', '$location', function($scope, $window, $location) {

}]);

// default - handle any requests not for an authorised URL
app.controller('defaultCtrl', ['$scope', '$window', '$location', function($scope, $window, $location) {
  $location.path('/home');
}]);