var app = angular.module("twitterapp");

app.factory('contactFactory', ['$http', 'tConfig', function ($http, tConfig) {

  return {

    sendContactData: function (contactData) {
      var apiData = tConfig.apiData,
        contactUrl = apiData.server + '/systemick/contact';

      return $http.post(contactUrl, contactData);
    }

  };

}]);