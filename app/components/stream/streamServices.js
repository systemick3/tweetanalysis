var app = angular.module("twitterapp")

app.factory('socket', function ($rootScope, tConfig) {
  var apiData = tConfig.apiData,
    socket = io.connect(apiData.streamServer);

  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    }
  };
});