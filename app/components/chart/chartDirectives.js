var app = angular.module("twitterapp");

// Modal dialog to display analysis chart data
app.directive('chartModal', ['chartFactory', 'userFactory', function (chartFactory, userFactory) {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    templateUrl: "components/chart/views/chart.html",
    link: function (scope, element, attrs) {
      var chartType = attrs.type,
        prop = chartType + 'ChartVisible',
        chartId = chartType + 'Chart',
        containerId = chartType + 'ChartContainer',
        modalId = chartType + 'ChartModal',
        modalShowId = modalId + 'Show',
        dimensions;

      scope.chartType = chartType;
      scope.chartProp = prop;
      scope.chartId = chartId;
      scope.modalId = modalId;
      scope.containerId = containerId;


      userFactory.userSessionData().then(function (response) {
        if (response.data.data) {
          dimensions = chartFactory.getChartDimensions();

          chartFactory.getUserAnalyses(scope.user.user_id, dimensions.splice).then(function (data) {

            var context = document.getElementById(chartId).getContext("2d"),
              chartData = chartFactory.getChartData(data.data.data, chartType),
              options = chartFactory.getChartOptions(),
              myLineChart,
              legend,
              container = angular.element(document.getElementById(containerId)),
              dialog = angular.element(container.parent()),
              modal = angular.element(document.getElementById(modalId)),
              show = angular.element(document.getElementById(modalShowId)),
              close = angular.element(dialog.find('.close'));

            show.on('click', function () {
              modal.css('display', 'block');
            });

            close.on('click', function () {
              modal.css('display', 'none');
            });

            var drawChart = function (ctx) {
              ctx.canvas.width = dimensions.width;
              ctx.canvas.height = dimensions.height;
              chartData.labels = chartData.labels.splice(dimensions.splice * -1, dimensions.splice);
              myLineChart = new Chart(ctx).Line(chartData, options);
              legend = myLineChart.generateLegend();
              container.prepend(legend);
            };

            drawChart(context);

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