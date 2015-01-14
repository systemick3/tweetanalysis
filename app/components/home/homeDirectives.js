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
        scope.$watch('usertweets', function(nv) {
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
  });