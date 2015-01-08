angular.module("twitterapp")

  .factory('socket', function ($rootScope) {

    var socket = io.connect('http://localhost:3001', { query: "michael=javascript" });
    return {
      on: function (eventName, callback) {
        console.log('SOCKET');
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      }
    };
  })

  .factory("tweetsFactory", ['$http', 'tConfig', function($http, tConfig) {
    var TWEETS_PER_REQUEST = 5;
    var factory = {};
    var apiData = tConfig.apiData;

    factory.getUserTweets = function (user, maxId) {
      var userTweetsUrl = apiData.server + apiData.userTweets.url + '/' + user.screen_name + '/' + tConfig.numUserTweets;

      if (maxId) {
        userTweetsUrl += '/' + maxId;
      }

      console.log(userTweetsUrl);
      return $http.get(userTweetsUrl);
    };

    factory.getTweet = function(id) {
      var oneTweetUrl = apiData.server + apiData.oneTweet.url + '/' + id;
      return $http.get(oneTweetUrl);
    };

    factory.getUserAnalysis = function(userId) {
      var userAnalysisUrl = apiData.server + apiData.userAnalysis.url + '/' + userId;
      return $http.get(userAnalysisUrl);
    };

    factory.getRetweeters = function(tweetId) {
      var retweetersUrl = apiData.server + apiData.retweeters.url + '/' + tweetId;
      return $http.get(retweetersUrl);
    };

    factory.getUserMentions = function (userId) {
      var mentionsUrl = apiData.server + apiData.mentions.url + '/' + userId;
      return $http.get(mentionsUrl);
    };

    return factory;
  }]);