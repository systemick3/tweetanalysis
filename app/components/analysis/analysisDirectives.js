var app = angular.module("twitterapp");

app.directive('analysisPanel', [function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: "components/analysis/views/analysis.html",
  };
}]);

app.directive('analysisItem', ['userFactory', 'analysisFactory', function (userFactory, analysisFactory) {
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
      userFactory.userSessionData().then(function (response) {

        if (response.data.data) {
          // Ensure we have userAnalysis data
          analysisFactory.getUserAnalysis(scope.user.user_id).then(function (data) {

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
        }

      }, function (err) {
        element.html('');
        element.append(errorDiv);
      });
    }
  };
}]);