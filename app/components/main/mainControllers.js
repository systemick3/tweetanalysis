angular.module("twitterapp")

	// default - handle any requests not for an authorised URL
  .controller('defaultCtrl', ['$scope', '$window', '$location', function($scope, $window, $location) {
    console.log('defaultCtrl');
    $location.path('/home');
  }])

  // test: used for testing purposes
  // .controller('testCtrl', ['$scope', '$window', 'userFactory', function($scope, $window, userFactory) {

  // 	$scope.message = '';
  // 	userFactory.testData()
  // 	.success(function(data) {
  // 		$scope.message = data.message;
  // 	})
  // 	.error(function(error) {
  // 		console.log('error');
  // 	});

  //   userFactory.userSessionData()
  //   .success(function(data) {
  //     console.log(data);
  //   })
  //   .error(function(error) {
  //     console.log(error);
  //   });

  // }])

  // home: used to display home page content
  .controller('homeCtrl', ['$scope', '$window', '$location', '$rootScope', 'ipCookie', 'userFactory', 'tweetsFactory', 'tConfig', 'socket', function($scope, $window, $location, $rootScope, ipCookie, userFactory, tweetsFactory, tConfig, socket) {
    console.log('homeCtrl');

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

      userFactory.userSessionData()
      .success(function(data) {
        console.log('GETTING USER DATA');
        console.log(data);
        $window.sessionStorage.user_id = data.user_id;
        $window.sessionStorage.screen_name = data.screen_name;
        $scope.user = data;
        $scope.tweets_for = 'user ' + $scope.user.screen_name;

        // Get the full user data from Twitter
        userFactory.userTwitterData(data.user_id)
          .success(function (data) {
            //console.log('USER');
            //console.log(data);

            var mongo_id = $scope.user._id;
            $scope.user = data;
            $scope.user._id = mongo_id;
            console.log($scope.user);
          });

        $scope.usertweets = null;
        $scope.tweetsLoaded = false;
        $scope.allTweetsLoaded = false;
        tweetsFactory.getUserTweets($scope.user)
          .success(function (data) {
            $scope.tweetsLoaded = true;
            $scope.usertweets = processTweets(data);
            console.log($scope.usertweets);

            // $scope.oneTweet = tweetsFactory.getTweet($scope.usertweets[2].id_str)
            //   .success(function (data) {
            //     console.log('ONE TWEET');
            //     console.log(data);
            //   });
          })
          .error(function (error) {
            console.log('ERROR');
            $scope.status = 'Unable to load tweets for user: ' + error.message;
          });

        tweetsFactory.getUserAnalysis($scope.user.user_id)
          .success(function (data) {
            console.log(data);
            $scope.userAnalysis = data;
          })
          .error(function (err) {
            console.log(err);
          });
      })
      .error(function(error) {
      	// TODO: redirect to the error page and handle the error
        console.log(error);
      });

    };

    $scope.getMoreTweets = function () {
      //alert('getMore');
      $scope.tweetsLoaded = false;
      var maxId = $scope.usertweets[$scope.usertweets.length - 1].id_str;
      tweetsFactory.getUserTweets($scope.user, maxId)
        .success(function (data) {
          console.log(data);
          var newTweets = processTweets(data.slice(1));
          console.log(newTweets);
          $scope.usertweets = $scope.usertweets.concat(newTweets);
          console.log($scope.usertweets);
          $scope.tweetsLoaded = true;

          if (newTweets.length < tConfig.numUserTweets) {
            $scope.allTweetsLoaded = true;
          }
          
        });
      //alert('getMore ' + maxId);
    };

    $scope.expand = function(id) {
      alert('Hello ' + id);
    };


    // $scope.tweets = [];
 
    // socket.on('tweets', function (data) {
    //   console.log(data);
    //   $scope.tweets = data.concat($scope.tweets);
    //   //$scope.tweets = $scope.tweets.concat(data);
    // });

  }])

  // error: handle errors
  .controller('errorCtrl', ['$scope', '$window', '$location', function($scope, $window, $location) {
  	
  }]);

var processTweets = function(tweets) {
  for (var i=0; i<tweets.length; i++) {
    tweets[i].display_text = processTweetLinks(tweets[i].text);
    tweets[i].short_date = tweets[i].created_at.substring(0, 16);
  }
  return tweets;
};

var processTweetLinks = function (text) {
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
  text = text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
  exp = /(^|\s)#(\w+)/g;
  text = text.replace(exp, "$1<a href='http://search.twitter.com/search?q=%23$2' target='_blank'>#$2</a>");
  exp = /(^|\s)@(\w+)/g;
  text = text.replace(exp, "$1<a href='http://www.twitter.com/$2' target='_blank'>@$2</a>");
  return text;
};