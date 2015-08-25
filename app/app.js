'use strict';

angular.module("twitterapp", ['ngRoute', 'ngSanitize', 'ipCookie', 'btford.socket-io', 'infinite-scroll'])
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider.when('/home', {
      templateUrl: 'components/home/views/home.html',
      controller: 'homeCtrl'
    });
    // $routeProvider.when('/login', {
    //   templateUrl: 'components/user/views/login.html',
    //   controller: 'loginCtrl'
    // });
    $routeProvider.when('/login/callback', {
      templateUrl: 'components/user/views/loginCallback.html',
      controller: 'loginCallbackCtrl'
    });
    $routeProvider.when('/login/callback/:id', {
      templateUrl: 'components/user/views/loginCallback.html',
      controller: 'loginCallbackCtrl'
    });
    $routeProvider.when('/logout', {
      templateUrl: 'components/user/views/logout.html',
      controller: 'logoutCtrl'
    });
    $routeProvider.when('/error', {
      templateUrl: 'components/home/views/error.html',
      controller: 'errorCtrl'
    });
    $routeProvider.otherwise({
      templateUrl: 'components/home/views/default.html',
      controller: 'defaultCtrl'
    });

    $httpProvider.interceptors.push('authInterceptor');

  })

  .constant('tConfig', {
    'apiData': {
      //'server':           'http://localhost:3001',
      'siteUrl':          'http://tweetreport.co.uk',
      'server':           'http://api.systemick-web-development.co.uk',
      'streamServer':     'http://localhost:3002',
      'testUrl':          '/tweetapp/test',
      'loginUrl':         '/tweetapp/login',
      'twitterLoginUrl':  '/tweetapp/login/twitter',
      'userSessionUrl':   '/tweetapp/auth/session',
      'userDataUrl':      '/tweetapp/auth/user',
      'contactUrl':       '/systemick/contact',
      'userTweets':       { url: '/tweetapp/auth/tweet/user', params: ['screenName', 'tweetCount'] },
      'oneTweet':         { url: '/tweetapp/auth/tweet/one', params: ['id'] },
      'userAnalysis':     { url: '/tweetapp/auth/analysis/user', params: ['userId'] },
      'userAnalyses':     { url: '/tweetapp/auth/analysis/chart', params: ['userId'] },
      'retweeters':       { url: '/tweetapp/auth/tweet/retweeters', params: ['tweetId'] },
      'mentions':         { url: '/tweetapp/auth/tweet/mentions', params: ['userId'] },
      'replies':          { url: '/tweetapp/auth/tweet/replies', params: ['userId', 'tweetId']},
      'sentiment':        { url: '/tweetapp/auth/tweet/sentiment', params: ['tweetId', 'isReply']},
      'trends':           { url: '/tweetapp/auth/tweet/trends', params: []}
    },
    'sessionCookieName':  'TSESS',
    'numUserTweets': 20
  });
