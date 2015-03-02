var app = angular.module("twitterapp");

app.factory('chartFactory', ['$http', 'tConfig', function ($http, tConfig) {
  var apiData = tConfig.apiData,
    analysesPromise;

  return {
    getUserAnalyses: function (userId, analysisCount) {
      var userAnalysesUrl = apiData.server + apiData.userAnalyses.url + '/' + userId + '/' + analysisCount;

      if (!analysesPromise) {
        return $http.get(userAnalysesUrl);
      }
      return analysesPromise;
    },

    // Utility function to determine the height & width
    // of the modal and the number of items to fetch from the API
    // according to the screen size
    getChartDimensions: function () {
      if (screen.width >= 1368) {
        return {
          width: 1000,
          height: 500,
          splice: 30
        };
      } else if (screen.width >= 1024) {
        return {
          width: 900,
          height: 500,
          splice: 25
        };
      } else if (screen.width >= 768) {
        return {
          width: 600,
          height: 500,
          splice: 15
        };
      } else if (screen.width >= 667) {
        return {
          width: 580,
          height: 500,
          splice: 12
        };
      } else {
        return {
          width: 320,
          height: 500,
          splice: 8
        };
      }
    },

    // Utilty function to format analysis data
    // in a format required by the chart
    getChartData: function (data, chartType) {
      var labels = [],
        tweets = [],
        favourites = [],
        retweets = [],
        followers = [],
        mentions = [];

      data = data.reverse();

      angular.forEach(data, function (element) {
        labels.push(element.date);
        tweets.push(element.seven.tweetCount);
        retweets.push(element.seven.retweetCount);
        favourites.push(element.seven.favouriteCount);
        followers.push(element.seven.followersCount || 0);
        mentions.push(element.seven.mentionsCount);
      });

      if (chartType === 'analysis') {

        return {
          labels: labels,
          datasets: [
            {
              label: 'Tweets',
              fillColor: "rgba(41,128,285,0.2)",
              strokeColor: "rgba(41,128,285,1)",
              pointColor: "rgba(41,128,285,1)",
              lineColor:  '#2980B9',
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(41,128,285,1)",
              data: tweets,
              multiTooltipTemplate: "<%= datasetLabel %> - <%= Tweets %>"
            },

            {
              label: 'Retweets',
              fillColor: "rgba(228,203,203,0.2)",
              strokeColor: "rgba(228,203,203,1)",
              pointColor: "rgba(228,203,203,1)",
              lineColor:  '#E4CBCB',
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(228,203,203,1)",
              data: retweets
            },

            {
              label: 'Favourites',
              fillColor: "rgba(113,180,111,0.2)",
              strokeColor: "rgba(113,180,111,1)",
              pointColor: "rgba(113,180,111,1)",
              lineColor:  '#71B46F',
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(113,180,111,1)",
              data: favourites
            },

            {
              label: 'Mentions',
              fillColor: "rgba(242,132,137,0.2)",
              strokeColor: "rgba(242,132,137,1)",
              pointColor: "rgba(242,132,137,1)",
              lineColor:  '#F28489',
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(242,132,137,1)",
              data: mentions
            },
          ]
        };
      } else {
        return {
          labels: labels,
          datasets: [
            {
              label: 'Followers',
              fillColor: "rgba(204,204,204,0.2)",
              strokeColor: "rgba(204,204,204,1)",
              pointColor: "rgba(204,204,204,1)",
              lineColor:  '#CCCCCC',
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(204,204,204,1)",
              data: followers
            },
          ]
        };
      }

    },

    // Return an object containing options for the chart
    getChartOptions: function () {
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