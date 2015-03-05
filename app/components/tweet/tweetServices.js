var app = angular.module("twitterapp");

app.factory("tweetFactory", ['$http', 'tConfig', function ($http, tConfig) {
  var TWEETS_PER_REQUEST = 5,
    userMentionsPromise,
    apiData = tConfig.apiData;

  return {

    getUserTweets: function (user, maxId) {
      var userTweetsUrl = apiData.server + apiData.userTweets.url + '/' + user.screen_name + '/' + tConfig.numUserTweets;

      if (maxId) {
        userTweetsUrl += '/' + maxId;
      }

      return $http.get(userTweetsUrl);
    },

    getTweet: function (id) {
      var oneTweetUrl = apiData.server + apiData.oneTweet.url + '/' + id;
      return $http.get(oneTweetUrl);
    },

    getRetweeters: function (tweetId) {
      var retweetersUrl = apiData.server + apiData.retweeters.url + '/' + tweetId;
      return $http.get(retweetersUrl);
    },

    getUserMentions: function (userId) {
      var mentionsUrl = apiData.server + apiData.mentions.url + '/' + userId;

      if (!userMentionsPromise) {
        userMentionsPromise = $http.get(mentionsUrl).then(function (response) {
          return response;
        });
      }
      return userMentionsPromise;
    },

    getReplies: function (userId, tweetId) {
      var repliesUrl = apiData.server + apiData.replies.url + '/' + userId + '/' + tweetId;
      return $http.get(repliesUrl);
    },

    getSentiment: function (tweetId, isReply) {
      var sentimentUrl = apiData.server + apiData.sentiment.url + '/' + tweetId;

      if (isReply) {
        sentimentUrl += '/' + 'true';
      }

      return $http.get(sentimentUrl);
    },

    getTrends: function () {
      var trendsUrl = apiData.server + apiData.trends.url;
      return $http.get(trendsUrl);
    },

    processTweets: function (tweets) {
      var i;
      for (i = 0; i < tweets.length; i++) {
        tweets[i].display_text = this.processTweetLinks(tweets[i].text);
        tweets[i].short_date = tweets[i].created_at.substring(0, 16);
      }
      return tweets;
    },

    processTweetLinks: function (text) {
      var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
      text = text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
      exp = /(^|\s)#(\w+)/g;
      text = text.replace(exp, "$1<a href='https://twitter.com/hashtag/$2' target='_blank'>#$2</a>");
      exp = /(^|\s)@(\w+)/g;
      text = text.replace(exp, "$1<a href='http://www.twitter.com/$2' target='_blank'>@$2</a>");
      return text;
    }

  };

}]);