var app = angular.module("twitterapp");

app.factory("homeFactory", ['$http', 'tConfig', function ($http, tConfig) {
  var TWEETS_PER_REQUEST = 5,
    userAnalysisPromise,
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

    getTweet: function(id) {
      var oneTweetUrl = apiData.server + apiData.oneTweet.url + '/' + id;
      return $http.get(oneTweetUrl);
    },

    getUserAnalysis: function(userId) {
      var userAnalysisUrl = apiData.server + apiData.userAnalysis.url + '/' + userId;

      if (!userAnalysisPromise) {
        userAnalysisPromise = $http.get(userAnalysisUrl).then(function (response) {
          return response;
        });
      }
      return userAnalysisPromise;
    },

    getRetweeters: function(tweetId) {
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

    getUserAnalyses: function (userId, analysisCount) {
      var userAnalysesUrl = apiData.server + apiData.userAnalyses.url + '/' + userId + '/' + analysisCount;
      return $http.get(userAnalysesUrl);
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
      for (var i=0; i<tweets.length; i++) {
        tweets[i].display_text = this.processTweetLinks(tweets[i].text);
        tweets[i].short_date = tweets[i].created_at.substring(0, 16);
      }
      return tweets;
    },

    processTweetLinks: function (text) {
      var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
      text = text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
      exp = /(^|\s)#(\w+)/g;
      text = text.replace(exp, "$1<a href='http://search.twitter.com/search?q=%23$2' target='_blank'>#$2</a>");
      exp = /(^|\s)@(\w+)/g;
      text = text.replace(exp, "$1<a href='http://www.twitter.com/$2' target='_blank'>@$2</a>");
      return text;
    },

    // Utility function to determine the height & width
    // of the modal and the number of items to fetch from the API
    // according to the screen size
    getChartDimensions: function() {
      if (screen.width >= 1368) {
        return {
          width: 1000,
          height: 500,
          splice: 30
        };
      }
      else if (screen.width >= 1024) {
        return {
          width: 900,
          height: 500,
          splice: 25
        };
      }
      else if (screen.width >= 768) {
        return {
          width: 600,
          height: 500,
          splice: 15
        };
      }
      else if (screen.width >= 667) {
        return {
          width: 580,
          height: 500,
          splice: 12
        };
      }
      else {
        return {
          width: 320,
          height: 500,
          splice: 8
        };
      }
    },

    // Utilty function to format analysis data
    // in a format required by the chart
    getChartData: function (data) {
      var labels = [],
        tweets = [],
        favourites = [],
        retweets = [],
        mentions =[];

      data = data.reverse();

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

    },

    // Return an object containing options for the chart
    getChartOptions: function() {
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
    }

  };

}]);