angular.module("twitterapp")

	// default - handle any requests not for an authorised URL
  .controller('defaultCtrl', ['$scope', '$window', '$location', function($scope, $window, $location) {
    console.log('defaultCtrl');
    $location.path('/home');
  }])

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

          tweetsFactory.getTrends()
            .success(function (data) {
              console.log('TRENDS');
              $scope.trends = data.data[0].trends;
              console.log($scope.trends);
            })
            .error(function (err) {
              console.log(err);
            });

          tweetsFactory.getUserAnalyses(userId)
            .success(function (data) {

              var chartData = getChartData(data.data);

              // Get the context of the canvas element we want to select
              var ctx = document.getElementById("myChart").getContext("2d");
              var options = {
                ///Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines : true,

                //String - Colour of the grid lines
                scaleGridLineColor : "rgba(0,0,0,.05)",

                //Number - Width of the grid lines
                scaleGridLineWidth : 1,

                //Boolean - Whether to show horizontal lines (except X axis)
                scaleShowHorizontalLines: true,

                //Boolean - Whether to show vertical lines (except Y axis)
                scaleShowVerticalLines: true,

                //Boolean - Whether the line is curved between points
                bezierCurve : true,

                //Number - Tension of the bezier curve between points
                bezierCurveTension : 0.4,

                //Boolean - Whether to show a dot for each point
                pointDot : true,

                //Number - Radius of each point dot in pixels
                pointDotRadius : 4,

                //Number - Pixel width of point dot stroke
                pointDotStrokeWidth : 1,

                //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
                pointHitDetectionRadius : 20,

                //Boolean - Whether to show a stroke for datasets
                datasetStroke : true,

                //Number - Pixel width of dataset stroke
                datasetStrokeWidth : 2,

                //Boolean - Whether to fill the dataset with a colour
                datasetFill : true,

                //String - A legend template
                legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].pointColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
              };
              var myLineChart = new Chart(ctx).Line(chartData, options);
              var legend = myLineChart.generateLegend();
              var container = document.getElementById("chartContainer");
              angular.element(container).append(legend);

              Chart.defaults.global.responsive = true;
            })
            .error(function (err) {
              console.log('ANALYSES ERROR');
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
            selectedTweet.reach = data.reach;
            selectedTweet.show_retweeters = true;
          })
          .error(function (err) {
            console.log(err);
          });
      }

    };

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

        tweetsFactory.getReplies(userId, tweetId)
          .success(function (data) {
            console.log(data);
            selectedTweet.replies = processTweets(data.replies);
            selectedTweet.show_replies = true;
          })
          .error(function (err) {
            console.log(err);
          });
      }

    };

    $scope.showSentiment = function (tweetId, replyId) {
      var selectedTweet,
        replies;

      // Find the tweet that has been selected
      for (var i=0; i<$scope.usertweets.length; i++) {
        if ($scope.usertweets[i].id_str == tweetId) {
          selectedTweet = $scope.usertweets[i];
          break;
        }
      }

      // If the tweet is a reply find it in the replies
      // of the selected tweet
      if (replyId) {
        replies = selectedTweet.replies;
        for (var j=0; j < replies.length; j++) {
          if (replies[j].id_str == replyId) {
            selectedTweet = replies[i];
          }
        }
      }

      // If sentiment has been fetched from server just show it
      if (selectedTweet.sentiment) {
        selectedTweet.show_sentiment = true;
      }
      else {
        // Fetch from server
        tweetsFactory.getSentiment(selectedTweet.id_str, replyId)
          .success(function (data) {
            selectedTweet.sentiment = data.sentiment;
            selectedTweet.show_sentiment = true;
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

    // Hide the replies
    $scope.hideReplies = function (tweetId) {
      for (var i=0; i<$scope.usertweets.length; i++) {
        if ($scope.usertweets[i].id_str == tweetId) {
          $scope.usertweets[i].show_replies = false;
          break;
        }
      }
    };

    // Hide the replies
    $scope.hideSentiment = function (tweetId, replyId) {
      var selectedTweet,
        replies;

      // Find the tweet that has been selected
      for (var i=0; i<$scope.usertweets.length; i++) {
        if ($scope.usertweets[i].id_str == tweetId) {
          selectedTweet = $scope.usertweets[i];
          break;
        }
      }

      // If this is a reply then find it in the replies
      // of the selected tweet
      if (replyId) {
        replies = selectedTweet.replies;
        for (i=0; i<replies.length; i++) {
          if (replies[i].id_str == replyId) {
            selectedTweet = replies[i];
          }
        }
      }

      selectedTweet.show_sentiment = false;
    };

    $scope.selectTrends = function (trend) {
      return trend.name.length <= 20;
    };


    $scope.streamtweets = [];
    socket.on('tweets', function (data) {
      var oldTweets = [];

      if ($scope.streamtweets.length >= 8) {
        $scope.streamtweets.pop();
        oldTweets = $scope.streamtweets;
      }
      else {
        oldTweets = $scope.streamtweets;
      }
      $scope.streamtweets = processTweets(data.concat(oldTweets));
    });

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

var getChartData = function (data) {
  console.log('ANALYSES');
  console.log(data);

  var labels = [],
    datasets = [],
    tweets = [],
    favourites = [],
    retweets = [],
    mentions =[],
    dataset = {};

  angular.forEach(data, function(element, index){
    labels.push(element.date);
    tweets.push(element.seven.tweetCount);
    retweets.push(element.seven.retweetCount);
    favourites.push(element.seven.favouriteCount);
    mentions.push(element.seven.mentionsCount);
  });

  return {
    labels: labels,
    datasets: [
      {
        label: 'Tweets',
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        lineColor:  '#dcdcdc',
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: tweets,
        multiTooltipTemplate: "<%= datasetLabel %> - <%= Tweets %>"
      },

      {
        label: 'Retweets',
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        lineColor:  '#97bbcd',
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: retweets
      },

      {
        label: 'Favourites',
        fillColor: "rgba(121,167,185,0.2)",
        strokeColor: "rgba(121,167,185,1)",
        pointColor: "rgba(121,167,185,1)",
        lineColor:  '#79a7b9',
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(121,167,185,1)",
        data: favourites
      },

      {
        label: 'Mentions',
        fillColor: "rgba(101,147,165,0.2)",
        strokeColor: "rgba(101,147,165,1)",
        pointColor: "rgba(101,147,165,1)",
        lineColor:  '#6593a5',
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(101,147,165,1)",
        data: mentions
      },
    ]
  };

};