var app = angular.module("twitterapp");

// Modal dialog to display chart data
app.directive('chartModal', ['chartFactory', 'userFactory', function (chartFactory, userFactory) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: "components/chart/views/chart.html",
    link: function (scope, element, attrs) {
      var i,
        dimensions,
        close;

      userFactory.userSessionData().then(function (data) {

        dimensions = chartFactory.getChartDimensions()

        chartFactory.getUserAnalyses(scope.user.user_id, dimensions.splice)
          .success(function (data) {
            var ctx = document.getElementById("myChart").getContext("2d"),
              chartData = chartFactory.getChartData(data.data),
              options = chartFactory.getChartOptions(),
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
app.directive('tweetChart', ['chartFactory', function (chartFactory) {
  return {
    restrict: 'E',
    template: '<canvas id="myChart" width="0" height="0">',
    replace: true,
  };

}]);