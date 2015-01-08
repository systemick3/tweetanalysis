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
  .controller('homeCtrl', 
    ['$scope', '$window', '$location', '$rootScope', 'ipCookie', 'userFactory', 'tweetsFactory', 'tConfig', 'socket', 
    function($scope, $window, $location, $rootScope, ipCookie, userFactory, tweetsFactory, tConfig, socket) {

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

      userFactory.userSessionData()
      .success(function(data) {
        $window.sessionStorage.user_id = data.user_id;
        $window.sessionStorage.screen_name = data.screen_name;
        $scope.user = data;
        userId = data.user_id;
        $scope.tweets_for = 'user ' + $scope.user.screen_name;

        // Get the full user data from Twitter
        userFactory.userTwitterData(data.user_id)
          .success(function (data) {
            var mongo_id = $scope.user._id;
            $scope.user = data;
            $scope.user._id = mongo_id;
            console.log($scope.user);
          });

        // Get the first set of tweets
        $scope.usertweets = null;
        $scope.tweetsLoaded = false;
        $scope.allTweetsLoaded = false;
        tweetsFactory.getUserTweets($scope.user)
          .success(function (data) {
            $scope.tweetsLoaded = true;
            $scope.usertweets = processTweets(data);
            console.log($scope.usertweets);
          })
          .error(function (error) {
            $scope.status = 'Unable to load tweets for user: ' + error.message;
          });

        // Get the user analysis
        tweetsFactory.getUserAnalysis(userId)
          .success(function (data) {
            console.log(data);
            $scope.userAnalysis = data;

            // Ge the number of mentions
            tweetsFactory.getUserMentions(userId)
              .success(function (mentions) {
                console.log('MENTIONS');
                console.log(mentions);
                console.log($scope.userAnalysis);
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

      })
      .error(function(error) {
      	// TODO: redirect to the error page and handle the error
        console.log(error);
      });

    };

    ////////////////// Functions used by the home page /////////////////////////

    // Add more tweets to the end of the list
    $scope.getMoreTweets = function () {
      $scope.tweetsLoaded = false;
      var maxId = $scope.usertweets[$scope.usertweets.length - 1].id_str;
      tweetsFactory.getUserTweets($scope.user, maxId)
        .success(function (data) {
          var newTweets = processTweets(data.slice(1));
          $scope.usertweets = $scope.usertweets.concat(newTweets);
          $scope.tweetsLoaded = true;

          if (newTweets.length < tConfig.numUserTweets) {
            $scope.allTweetsLoaded = true;
          }
        });
    };

    // Show all the retweeters of a tweet
    $scope.retweeters = {};
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

        tweetsFactory.getRetweeters(tweetId)
          .success(function (data) {
            selectedTweet.retweeters = data.retweeters;
            selectedTweet.range = data.range;
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