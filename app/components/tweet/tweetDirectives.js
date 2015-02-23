var app = angular.module("twitterapp");

app.directive('tweetList', function () {
  return {
    templateUrl: 'components/tweet/views/tweet.html',
    link: function (scope, element, attrs) {
      scope.$watch('usertweets', function (nv) {
        if (scope.usertweets !== null) {
          var data = scope.usertweets;
          scope.data = data;
        }
      });
    }
  };

});

app.directive('showRetweetersLink', ['tweetFactory', function (tweetFactory) {
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
          tweetFactory.getRetweeters(selectedTweet.id_str)
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

app.directive('showRepliesLink', ['tweetFactory', function (tweetFactory) {
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
            tweetFactory.getReplies(scope.user.id_str, selectedTweet.id_str)
              .success(function (data) {
                selectedTweet.replies = tweetFactory.processTweets(data.replies);
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

app.directive('showSentimentLink', ['tweetFactory', function (tweetFactory) {
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
          tweetFactory.getSentiment(selectedTweet.id_str, replyId)
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