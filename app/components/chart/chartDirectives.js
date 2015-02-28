var app = angular.module("twitterapp");

// Modal dialog to display analysis chart data
app.directive('analysisChartModal', ['chartFactory', 'userFactory', function (chartFactory, userFactory) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: "components/chart/views/chart.html",
    link: function (scope, element, attrs) {
      var i,
        dimensions,
        close;

      userFactory.userSessionData().then(function (response) {
        if (response.data.data) {
          dimensions = chartFactory.getChartDimensions();

          chartFactory.getUserAnalyses(scope.user.user_id, dimensions.splice).then(function (data) {

            var ctx = document.getElementById("analysisChart").getContext("2d"),
              chartData = chartFactory.getChartData(data.data.data, 'analysis'),
              options = chartFactory.getChartOptions(),
              myLineChart,
              legend,
              container = angular.element(document.getElementById("analysisChartContainer")),
              dialog = angular.element(container.parent()),
              close = angular.element(dialog.find('.close'));

            ctx.canvas.width = dimensions.width;
            ctx.canvas.height = dimensions.height;
            chartData.labels = chartData.labels.splice(dimensions.splice * -1, dimensions.splice);
            myLineChart = new Chart(ctx).Line(chartData, options);
            legend = myLineChart.generateLegend();
            container.prepend(legend);

          }, function (err) {
            scope.chartError = 'Unable to load chart data. Please try again later.';
          });

        }

      }, function (err) {
        scope.twitterDataError = 'Unable to retrieve data from Twitter. Please try again later.';
      });
    }
  };
}]);

// Modal dialog to display analysis chart data
app.directive('followersChartModal', ['chartFactory', 'userFactory', function (chartFactory, userFactory) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: "components/chart/views/followersChart.html",
    link: function (scope, element, attrs) {
      var i,
        dimensions,
        close;

      userFactory.userSessionData().then(function (response) {
        if (response.data.data) {
          dimensions = chartFactory.getChartDimensions();

          chartFactory.getUserAnalyses(scope.user.user_id, dimensions.splice).then(function (data) {

            var ctx = document.getElementById("followersChart").getContext("2d"),
              chartData = chartFactory.getChartData(data.data.data, 'followers'),
              options = chartFactory.getChartOptions(),
              myLineChart,
              legend,
              container = angular.element(document.getElementById("followersChartContainer")),
              dialog = angular.element(container.parent()),
              close = angular.element(dialog.find('.close'));

            ctx.canvas.width = dimensions.width;
            ctx.canvas.height = dimensions.height;
            chartData.labels = chartData.labels.splice(dimensions.splice * -1, dimensions.splice);
            myLineChart = new Chart(ctx).Line(chartData, options);
            legend = myLineChart.generateLegend();
            container.prepend(legend);

          }, function (err) {
            scope.chartError = 'Unable to load chart data. Please try again later.';
          });

        }

      }, function (err) {
        scope.twitterDataError = 'Unable to retrieve data from Twitter. Please try again later.';
      });
    }
  };
}]);

// Replace the html with the canvas element for the analysis chart
app.directive('analysisChart', [function () {
  return {
    restrict: 'E',
    template: '<canvas id="analysisChart" width="0" height="0">',
    replace: true,
  };

}]);

// Replace the html with the canvas element for the followers chart
app.directive('followersChart', [function () {
  return {
    restrict: 'E',
    template: '<canvas id="followersChart" width="0" height="0">',
    replace: true,
  };

}]);