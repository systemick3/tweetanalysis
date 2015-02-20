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
    template: '<span class="retweeters"><a href="" class="show-link">Retweets</a></span>',
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
              selectedTweet.retweeters = 'Unable to load retweeters';
              retweetersElement.slideToggle('slow');
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
    template: '<span class="replies"><a href="" class="show-link">Replies</a></span>',
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
                repliesElement.slideToggle('slow');
              })
              .error(function (err) {
                selectedTweet.replies = 'Unable to load replies';
                repliesElement.slideToggle('slow');
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
    template: '<span class="sentiment"><a href="" class="show-link">Sentiment</a></span>',
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
              selectedTweet.sentiment = 'Unable to load sentiment';
              sentimentElement.slideToggle('slow');
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

          analysisData = scope.userAnalysis.analysis[attrs.analysisLength];
          tweetsText = analysisData.tweetCount + ' tweets';

          if (analysisData.tweetsRetweetedCount > 0) {
            tweetsText += ' (' + analysisData.tweetsRetweetedCount + ' retweets)';
          }

          // Create the divs that will be the content of the panel
          tweetsDiv = angular.element('<div>').text(tweetsText);
          favouritesDiv = angular.element('<div>').text(analysisData.favouriteCount + ' favourites');
          retweetsDiv = angular.element('<div>').text(analysisData.retweetCount + ' retweets');
          mentionsDiv = angular.element('<div>').text(analysisData.mentionsCount + ' mentions');

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

// Modal dialog to display chart data
app.directive('chartModal', ['homeFactory', 'userFactory', function (homeFactory, userFactory) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: "components/views/directive/chart.html",
    link: function (scope, element, attrs) {
      var i,
        dimensions,
        close;

      userFactory.userSessionData().then(function (data) {

        dimensions = homeFactory.getChartDimensions()

        homeFactory.getUserAnalyses(scope.user.user_id, dimensions.splice)
          .success(function (data) {
            var ctx = document.getElementById("myChart").getContext("2d"),
              chartData = homeFactory.getChartData(data.data),
              options = homeFactory.getChartOptions(),
              myLineChart,
              legend,
              container = angular.element(document.getElementById("chartContainer")),
              dialog = angular.element(container.parent()),
              close = angular.element(dialog.find('.close'));

            ctx.canvas.width = dimensions.width;
            ctx.canvas.height = dimensions.height;
            chartData.labels = chartData.labels.splice(dimensions.splice * -1, dimensions.splice);
            myLineChart = new Chart(ctx).Line(chartData, options);
            legend = myLineChart.generateLegend();
            container.prepend(legend);
          })
          .error(function (err) {
            scope.chartError = 'Unable to load chart data. Please try again later.';
          });

      }, function (err) {
        scope.twitterDataError = 'Unable to retrieve data from Twitter. Please try again later.';
      });
    }
  };
}]);

// Replace the html with the canvas element for the chart
app.directive('tweetChart', ['homeFactory', 'userFactory', function (homeFactory, userFactory) {
  return {
    restrict: 'E',
    template: '<canvas id="myChart" width="0" height="0">',
    replace: true,
  };

}]);