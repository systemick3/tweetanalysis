angular.module("twitterapp")

  .directive('tweetList', function () {
    return {
      link: function (scope, element, attrs) {
        //console.log('tweetList');
        //console.log(attrs['tweetList']);
        //console.log(scope);
        // for (var property in scope) {
        //   if (scope.hasOwnProperty(property)) {
        //       //console.log(scope[property]);
        //   }
        // }
        //console.log('end of tweetList');
        scope.$watch('usertweets', function (nv) {
          if (scope.usertweets !== null) {
            var data = scope.usertweets;
            //console.log(data);

            // for (var i=0; i<data.length; i++) {
            //   data[i].display_text = processTweetLinks(data[i].text);
            //   //console.log(processTweetLinks(scope.data.text));
            // }

            scope.data = data;
            //console.log(scope.data);
          }
          //console.log('WATCH');
          //console.log(scope.usertweets);
        });
      },
      //template: '<div class="panel tweet" ng-repeat="item in data" ng-bind-html="item.display_text"></div>',
      //scope: {}
      templateUrl: "components/views/directive/tweet.html"
    };

    // return function (scope, element, attrs) {
    //   console.log('tweetList');
    //   console.log(attrs['tweetList']);
    //   console.log(scope);
    //   var data = scope[attrs['tweetList']];
    //   console.log(data);
    // }
  })

  .directive('tweetChart', ['homeFactory', 'userFactory', function (homeFactory, userFactory) {
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
                chartData = getChartData(data.data),
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
      //datasets = [],
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