var app = angular.module("twitterapp");

app.directive('tweetList', function () {
  return {
    link: function (scope, element, attrs) {
      scope.$watch('usertweets', function (nv) {
        if (scope.usertweets !== null) {
          var data = scope.usertweets;
          scope.data = data;
        }
      });
    },
    templateUrl: "components/views/directive/tweet.html"
  };

});

app.directive('showRetweetersLink', ['homeFactory', function (homeFactory) {
  return {
    restrict: 'E',
    template: '<span class="retweeters"><a href="">retweets</a></span>',
    link: function (scope, element, attrs) {
      var linkElement,
        parentElement = element.parent(),
        retweetersElement = parentElement.siblings('.retweeters'),
        replace,
        i,
        close,
        tweetId = attrs['tweetId'];

      linkElement = element.find('a');

      for (i=0; i<scope.usertweets.length; i++) {
        if (scope.usertweets[i].id_str == tweetId) {
          selectedTweet = scope.usertweets[i];
          break;
        }
      }

      replace = (selectedTweet.retweet_count == 1) ? 'retweet' : 'retweets';
      linkElement.text(selectedTweet.retweet_count + ' ' + replace);

      element.on('click', function () {
        for (i=0; i<scope.usertweets.length; i++) {
          if (scope.usertweets[i].id_str == tweetId) {
            selectedTweet = scope.usertweets[i];
            break;
          }
        }

        if (!selectedTweet.retweeters) {
          homeFactory.getRetweeters(selectedTweet.id_str)
            .success(function (data) {
              selectedTweet.retweeters = data.retweeters;
              selectedTweet.reach = data.reach;
              retweetersElement.slideToggle('slow');
            })
            .error(function (err) {
              console.log(err);
            });
        }
        else {
          retweetersElement.slideToggle('slow');
        }

        close = retweetersElement.find('.fa-times');
        close.on('click', function () {
          retweetersElement.slideUp('slow');
        });

      });
    }
  };
}]);

app.directive('showRepliesLink', ['homeFactory', function (homeFactory) {
  return {
    restrict: 'E',
    template: '<span class="replies"><a href="">Replies</a></span>',
    link: function (scope, element, attrs) {
      var parentElement = element.parent(),
          repliesElement = parentElement.siblings('.replies'),
          tweetId = attrs['tweetId'],
          replyId,
          selectedTweet,
          close,
          i;

        element.on('click', function () {
          for (i=0; i<scope.usertweets.length; i++) {
            if (scope.usertweets[i].id_str == tweetId) {
              selectedTweet = scope.usertweets[i];
              break;
            }
          }

          if (!selectedTweet.replies) {
            homeFactory.getReplies(scope.user.id_str, selectedTweet.id_str)
              .success(function (data) {
                selectedTweet.replies = homeFactory.processTweets(data.replies);
                console.log(selectedTweet);
                repliesElement.slideToggle('slow');
              })
              .error(function (err) {
                console.log(err);
              });
          }
          else {
            repliesElement.slideToggle('slow');
          }

        });

        close = repliesElement.find('.fa-times');
        close.on('click', function () {
          repliesElement.slideUp();
        });
    }
  };
}]);

app.directive('showSentimentLink', ['homeFactory', function (homeFactory) {
  return {
    restrict: 'E',
    template: '<span class="sentiment"><a href="">Sentiment</a></span>',
    link: function (scope, element, attrs) {
       var parentElement = element.parent(), 
          sentimentElement = parentElement.next(),
          tweetId = attrs['tweetId'],
          replyId,
          selectedTweet,
          close;

      element.on('click', function() {
        // Find the tweet that has been selected
        for (var i=0; i<scope.usertweets.length; i++) {
          if (scope.usertweets[i].id_str == tweetId) {
            selectedTweet = scope.usertweets[i];
            break;
          }
        }

        // If the tweet is a reply find it in the replies
        // of the selected tweet
        if (attrs['replyId']) {
          replyId = attrs['replyId'];
          replies = selectedTweet.replies;
          for (var j=0; j < replies.length; j++) {
            if (replies[j].id_str == replyId) {
              selectedTweet = replies[j];
            }
          }
        }

        if (!selectedTweet.sentiment) {
          homeFactory.getSentiment(selectedTweet.id_str, replyId)
            .success(function (data) {
              selectedTweet.sentiment = data.sentiment;
              sentimentElement.slideToggle('slow');
            })
            .error(function (err) {
              console.log(err);
            });
        }
        else {
          sentimentElement.slideToggle('slow');
        }

      });

      close = sentimentElement.find('.fa-times');
      close.on('click', function () {
        sentimentElement.slideUp();
      });
    }
  };
}]);

app.directive('analysisPanel', ['userFactory', 'homeFactory', function (userFactory, homeFactory) {
  return {
    restrict: 'E',
    link: function (scope, element, attrs) {
      var analysisData,
        tweetsText,
        tweetsDiv,
        favouritesDiv,
        retweetsDiv,
        mentionsDiv,
        errorDiv = angular.element('<div>').text('Unable to load user data');

      // Ensure user session data is loaded so we have the userId
      userFactory.userSessionData().then(function (data) {

        // Ensure we have userAnalysis data
        homeFactory.getUserAnalysis(scope.user.user_id).then(function (data) {

          // Ensure we have the user mentions data
          homeFactory.getUserMentions(scope.user.user_id).then(function (data) {

            analysisData = scope.userAnalysis.analysis[attrs.analysisLength];
            tweetsText = analysisData.tweetCount + ' tweets';

            if (analysisData.tweetsRetweetedCount > 0) {
              tweetsText += ' (' + analysisData.tweetsRetweetedCount + ' retweets)';
            }

            // Create the divs that will be the content of the panel
            tweetsDiv = angular.element('<div>').text(tweetsText);
            favouritesDiv = angular.element('<div>').text(analysisData.favouriteCount + ' favourites');
            retweetsDiv = angular.element('<div>').text(analysisData.retweetCount + ' retweets');
            mentionsDiv = angular.element('<div>').text(analysisData.mentionCount + ' mentions');

            // Clear the loading gif then append the data
            element.html('');
            element.append(tweetsDiv);
            element.append(favouritesDiv);
            element.append(retweetsDiv);
            element.append(mentionsDiv);

          }, function (err) {
            element.html('');
            element.append(errorDiv);
          });

        }, function (err) {
          element.html('');
          element.append(errorDiv);
        });

      }, function (err) {
        element.html('');
        element.append(errorDiv);
      });
    }
  };
}]);

app.directive('streamTweetList', ['socket', function (socket) {
  return {
    link: function (scope, element, attrs) {
      scope.$watch('streamtweets', function () {
        if (scope['streamtweets'].length > 0) {
          var newTweet = scope.streamtweets[0],
            panelDiv = angular.element('<div>').attr('class', 'panel').addClass('tweet').addClass('ngFade')
            nameDiv = angular.element('<div>').attr('class', 'name'),
            link = angular.element('<a>').attr('href', 'https://twitter.com/' + newTweet.user.screen_name),
            nameSpan = angular.element('<span>').text(newTweet.user.name),
            screenNameSpan = angular.element('<span>').text(newTweet.user.screen_name),
            textDiv = angular.element('<div>').attr('class', 'text').html(newTweet.display_text);

          link.append(nameSpan).append(screenNameSpan);
          nameDiv.append(link);
          link.after(newTweet.short_date);
          panelDiv.append(nameDiv);
          panelDiv.append(textDiv);
          panelDiv.hide();
          panelDiv.css('opacity', 0);
          element.prepend(panelDiv);
          panelDiv.slideDown('fast');

          if (scope.streamtweets.length > 10) {
            element.find('.tweet:last-child').fadeOut().remove();
          }

          panelDiv.animate({
            opacity: 1,
          }, 600);
        }
      });
    }
  };

}]);

app.directive('tweetChart', ['homeFactory', 'userFactory', function (homeFactory, userFactory) {
  return {
    restrict: 'E',
    template: '<canvas id="myChart" width="720" height="200">',
    replace: true,
    link: function (scope, element, attrs) {

      userFactory.userSessionData().then(function (data) {

        homeFactory.getUserAnalyses(scope.user.user_id)
          .success(function (data) {
            Chart.defaults.global.responsive = true;

            var ctx = document.getElementById("myChart").getContext("2d"),
              chartData = getChartData(data.data);
              options = getChartOptions(),
              myLineChart = new Chart(ctx).Line(chartData, options),
              legend = myLineChart.generateLegend(),
              container = document.getElementById("chartContainer");

            angular.element(container).append(legend);
          })
          .error(function (err) {
            console.log(err);
          });
      });

    },

  };

}]);

var getChartData = function (data) {
  var labels = [],
    tweets = [],
    favourites = [],
    retweets = [],
    mentions =[];

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

var getChartOptions = function() {
  return {
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
};  

