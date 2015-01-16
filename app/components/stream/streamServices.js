var app = angular.module("twitterapp")

app.factory('socket', function ($rootScope) {

  var socket = io.connect('http://localhost:3002', { query: "michael=javascript" });
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