describe('analysisFactory', function () {
  var factory,
    baseUrl,
    user = {user_id: "165697756", screen_name: "systemick", _id: "54d743f9ae838cbd6266cd38"},
    userAnalysis = {"msg":"success","secs":1494,"analysis":{"seven":{"tweetCount":14,"favouriteCount":7,"retweetCount":29,"tweetsRetweetedCount":5},"thirty":{"tweetCount":42,"favouriteCount":28,"retweetCount":864,"tweetsRetweetedCount":14},"ninety":{"tweetCount":100,"favouriteCount":76,"retweetCount":2277,"tweetsRetweetedCount":32},"user_id":"165697756","created_at":1423412954688,"date":"2015-02-08"}};

  beforeEach(module("twitterapp"));

  beforeEach(inject(function (analysisFactory, $httpBackend, tConfig) {
    factory = analysisFactory;
    httpBackend = $httpBackend;
    config = tConfig;
    baseUrl = tConfig.apiData.server;
  }));

  it('should fetch a user analysis object', function () {
    var url = baseUrl + '/tweetapp/auth/analysis/user/165697756';
    httpBackend.whenGET('165697756').respond(userAnalysis);
    factory.getUserAnalysis(user).then(function(response) {
      expect(response).toBeDefined();
      expect(response.data).toEqual(userAnalysis);
    });
  });
});

describe('userAnalysisCtrl', function () {
  var $httpBackend, 
    $rootScope, 
    createController, 
    authRequestHandler,
    user = {user_id: "165697756", screen_name: "systemick", _id: "54d743f9ae838cbd6266cd38"},
    userAnalysis = {"msg":"success","secs":1494,"analysis":{"seven":{"tweetCount":14,"favouriteCount":7,"retweetCount":29,"tweetsRetweetedCount":5},"thirty":{"tweetCount":42,"favouriteCount":28,"retweetCount":864,"tweetsRetweetedCount":14},"ninety":{"tweetCount":100,"favouriteCount":76,"retweetCount":2277,"tweetsRetweetedCount":32},"user_id":"165697756","created_at":1423412954688,"date":"2015-02-08"}};

  beforeEach(module("twitterapp"));

  beforeEach(inject(function($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    // backend definition common for all tests
    authRequestHandler = $httpBackend.when('GET', 'http://api.systemick-web-development.co.uk/tweetapp/auth/session')
                          .respond(user);

    // Get hold of a scope (i.e. the root scope)
    $rootScope = $injector.get('$rootScope');
    // The $controller service is used to create instances of controllers
    var $controller = $injector.get('$controller');

    createController = function() {
     return $controller('userAnalysisCtrl', {'$scope' : $rootScope });
    };
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should fetch session data', function() {
    $httpBackend.expectGET('http://api.systemick-web-development.co.uk/tweetapp/auth/session');
    var controller = createController();
    $httpBackend.flush();
  });

  //TODO:
  // Get the code below to work

  // it('should fetch analysis data', function() {
  //    var controller = createController();
  //    $httpBackend.flush();

  //    // now you don’t care about the authentication, but
  //    // the controller will still send the request and
  //    // $httpBackend will respond without you having to
  //    // specify the expectation and response for this request

  //    $httpBackend.expectGET('http://api.systemick-web-development.co.uk/tweetapp/auth/analysis/user/165697756').respond(200, '');
  //    $httpBackend.flush();
  //  });

});

describe('analysisDirective', function () {
  var mockScope,
    compileService,
    userAnalysis = {"msg":"success","secs":1494,"analysis":{"seven":{"tweetCount":14,"favouriteCount":7,"retweetCount":29,"tweetsRetweetedCount":5},"thirty":{"tweetCount":42,"favouriteCount":28,"retweetCount":864,"tweetsRetweetedCount":14},"ninety":{"tweetCount":100,"favouriteCount":76,"retweetCount":2277,"tweetsRetweetedCount":32},"user_id":"165697756","created_at":1423412954688,"date":"2015-02-08"}};

  beforeEach(module("twitterapp"));

  // beforeEach(angular.mock.inject(function($rootScope, $compile) {
  //   mockScope = $rootScope.$new();
  //   compileService = $compile;
  //   mockScope.userAnalysis = userAnalysis;
  // }));

  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    compileService = _$compile_;
    mockScope = _$rootScope_;
  }));

  //TODO:
  // Get the code below to work

  // it("Create an analysis item", function () {
  //   //var compileFn = compileService("<analysis-item></analysis-item>");
  //   //var elem = compileFn(mockScope);

  //   var element = compileService("<analysis-item></analysis-item>")(mockScope);
  //   // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
  //   mockScope.$digest();

  //   expect(elem.children().length).toEqual(1);
  // });

});

describe('chartFactory', function () {
  var factory,
    httpBackend,
    config,
    user = {user_id: "165697756", screen_name: "systemick", _id: "54d743f9ae838cbd6266cd38"},
    testData = {"_id":"54b39e7fb4834fb37c3c2a71","created_at":1419329663081,"date":"2014-12-23","ninety":{"tweetCount":74,"favouriteCount":74,"retweetCount":4622,"tweetsRetweetedCount":20},"seven":{"favouriteCount":2,"mentionsCount":6,"retweetCount":19,"tweetCount":7,"tweetsRetweetedCount":2},"thirty":{"tweetCount":31,"favouriteCount":32,"retweetCount":173,"tweetsRetweetedCount":12},"user_id":"165697756"};

  beforeEach(module("twitterapp"));

  beforeEach(inject(function (chartFactory, $httpBackend, tConfig) {
    factory = chartFactory;
    httpBackend = $httpBackend;
    config = tConfig;
    baseUrl = tConfig.apiData.server;
  }));

  it('should fetch a list of user analyses objects for the chart', function () {
    var url = baseUrl + '/tweetapp/auth/analysis/chart/165697756';
    //var testData = {"_id":"54b39e7fb4834fb37c3c2a71","created_at":1419329663081,"date":"2014-12-23","ninety":{"tweetCount":74,"favouriteCount":74,"retweetCount":4622,"tweetsRetweetedCount":20},"seven":{"favouriteCount":2,"mentionsCount":6,"retweetCount":19,"tweetCount":7,"tweetsRetweetedCount":2},"thirty":{"tweetCount":31,"favouriteCount":32,"retweetCount":173,"tweetsRetweetedCount":12},"user_id":"165697756"};
    httpBackend.whenGET('165697756').respond(testData);
    factory.getUserAnalyses(user).then(function(response) {
      expect(response).toBeDefined();
      expect(response.data[0]).toEqual(testData);
    });
  });
});

describe("tweetFactory", function () {
  var factory, httpBackend, baseUrl = 'http://localhost:3001', user = {user_id: "165697756", screen_name: "systemick", _id: "54d743f9ae838cbd6266cd38"};

  beforeEach(module("twitterapp"));

  beforeEach(inject(function (tweetFactory, $httpBackend) {
    factory = tweetFactory;
    httpBackend = $httpBackend;
  }));

  var returnData = [{"created_at":"Sat Feb 07 09:18:37 +0000 2015","id":563990204969914400,"id_str":"563990204969914369","text":"How to optimise your code and make it run faster. https://t.co/sB1G7ynH2j. #javascript #javascript","source":"<a href=\"http://twitter.com/download/android\" rel=\"nofollow\">Twitter for Android</a>","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":165697756,"id_str":"165697756","name":"Mike Garthwaite","screen_name":"systemick","location":"Leeds","profile_location":null,"description":"Freelance Drupal, NodeJS and AngularJS developer","url":"http://t.co/1qqWK7ZYvv","entities":{"url":{"urls":[{"url":"http://t.co/1qqWK7ZYvv","expanded_url":"http://www.systemick-web-development.co.uk","display_url":"systemick-web-development.co.uk","indices":[0,22]}]},"description":{"urls":[]}},"protected":false,"followers_count":170,"friends_count":196,"listed_count":5,"created_at":"Mon Jul 12 08:50:20 +0000 2010","favourites_count":17,"utc_offset":0,"time_zone":"London","geo_enabled":true,"verified":false,"statuses_count":394,"lang":"en","contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"1A1B1F","profile_background_image_url":"http://abs.twimg.com/images/themes/theme9/bg.gif","profile_background_image_url_https":"https://abs.twimg.com/images/themes/theme9/bg.gif","profile_background_tile":false,"profile_image_url":"http://pbs.twimg.com/profile_images/2766412032/19a0bc89e2ddccbbc271d572d6d3ed63_normal.jpeg","profile_image_url_https":"https://pbs.twimg.com/profile_images/2766412032/19a0bc89e2ddccbbc271d572d6d3ed63_normal.jpeg","profile_link_color":"2FC2EF","profile_sidebar_border_color":"181A1E","profile_sidebar_fill_color":"252429","profile_text_color":"666666","profile_use_background_image":true,"default_profile":false,"default_profile_image":false,"following":false,"follow_request_sent":false,"notifications":false},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweet_count":0,"favorite_count":1,"entities":{"hashtags":[{"text":"javascript","indices":[75,86]},{"text":"javascript","indices":[87,98]}],"symbols":[],"user_mentions":[],"urls":[{"url":"https://t.co/sB1G7ynH2j","expanded_url":"https://medium.com/the-javascript-collection/lets-write-fast-javascript-2b03c5575d9e","display_url":"medium.com/the-javascript…","indices":[50,73]}]},"favorited":false,"retweeted":false,"possibly_sensitive":false,"lang":"en"}];
  var userAnalysis = {"msg":"success","secs":1494,"analysis":{"seven":{"tweetCount":14,"favouriteCount":7,"retweetCount":29,"tweetsRetweetedCount":5},"thirty":{"tweetCount":42,"favouriteCount":28,"retweetCount":864,"tweetsRetweetedCount":14},"ninety":{"tweetCount":100,"favouriteCount":76,"retweetCount":2277,"tweetsRetweetedCount":32},"user_id":"165697756","created_at":1423412954688,"date":"2015-02-08"}};

  it("should fetch a list of tweets", function () {
    var url = baseUrl + '/tweetapp/auth/tweet/user/systemick/20';
    httpBackend.whenGET(url).respond(returnData);
    factory.getUserTweets(user).then(function(response) {
      expect(response).toBeDefined();
      expect(response.data).toEqual(returnData);
    });
  });

  it('should fetch a single tweet', function () {
    var url = baseUrl + '/tweetapp/auth/tweet/one/563990204969914369';
    httpBackend.whenGET(url).respond(returnData);
    factory.getTweet('563990204969914369').then(function(response) {
      expect(response).toBeDefined();
      expect(response.data).toEqual(returnData);
    });
  });

  it('should fetch a list of retweeters', function () {
    var url = baseUrl + '/tweetapp/auth/tweet/retweeters/563713812675964928';
    var testData = {"msg":"success","retweeters":[{"screen_name":"radibit","followers_count":48},{"screen_name":"cburgdorf","followers_count":703},{"screen_name":"PascalPrecht","followers_count":1863}],"reach":2614};
    httpBackend.whenGET('563713812675964928').respond(testData);
    factory.getRetweeters(user).then(function(response) {
      expect(response).toBeDefined();
      expect(response.data).toEqual(testData);
    });
  });

  it('should fetch a list of tweets in which a user is mentioned', function () {
    var url = baseUrl + '/tweetapp/auth/tweet/mentions/165697756';
    httpBackend.whenGET('165697756').respond(userAnalysis);
    factory.getUserMentions(user).then(function(response) {
      expect(response).toBeDefined();
      expect(response.data).toEqual(userAnalysis);
    });
  });

  it('should fetch a list of tweets that are replies', function () {
    var url = baseUrl + '/tweetapp/auth/tweet/replies/165697756/563714348057890816';
    var testData = {"msg":"success","secs":977,"mentions":{"seven":3,"thirty":11,"ninety":19}};
    httpBackend.whenGET('165697756', '563714348057890816').respond(testData);
    factory.getReplies(user).then(function(response) {
      expect(response).toBeDefined();
      expect(response).toEqual(testData);
    });
  });

  it('should fetch a sentiment object for a tweets', function () {
    var url = baseUrl + '/tweetapp/auth/tweet/sentiment/563714348057890816';
    var testData = {"msg":"success","id":"563714348057890816","sentiment":{"score":-1,"comparative":-0.25,"tokens":["theglittervixen","better","or","worse"],"words":["worse","better"],"positive":["better"],"negative":["worse"]}};
    httpBackend.whenGET('563714348057890816').respond(testData);
    factory.getSentiment(user).then(function(response) {
      expect(response).toBeDefined();
      expect(response).toEqual(testData);
    });
  });

  // it('should fetch a list of trending hashtags', function () {
  //   var url = baseUrl + '/tweetapp/auth/tweet/trends';
  //   var testData = {"msg":"success","data":[{"trends":[{"name":"#lessinterestingfilms","query":"%23lessinterestingfilms","url":"http://twitter.com/search?q=%23lessinterestingfilms","promoted_content":null},{"name":"#WHUMUN","query":"%23WHUMUN","url":"http://twitter.com/search?q=%23WHUMUN","promoted_content":null},{"name":"Raith","query":"Raith","url":"http://twitter.com/search?q=Raith","promoted_content":null},{"name":"'Parklife'","query":"%27Parklife%27","url":"http://twitter.com/search?q=%27Parklife%27","promoted_content":null},{"name":"Simonsen","query":"Simonsen","url":"http://twitter.com/search?q=Simonsen","promoted_content":null},{"name":"Vuckic","query":"Vuckic","url":"http://twitter.com/search?q=Vuckic","promoted_content":null},{"name":"#Moonraker","query":"%23Moonraker","url":"http://twitter.com/search?q=%23Moonraker","promoted_content":null},{"name":"McCulloch","query":"McCulloch","url":"http://twitter.com/search?q=McCulloch","promoted_content":null},{"name":"Obertan","query":"Obertan","url":"http://twitter.com/search?q=Obertan","promoted_content":null},{"name":"Nade","query":"Nade","url":"http://twitter.com/search?q=Nade","promoted_content":null}],"as_of":"2015-02-08T16:47:32Z","created_at":"2015-02-08T16:43:16Z","locations":[{"name":"United Kingdom","woeid":23424975}]}]};
  //   httpBackend.whenGET().respond(testData);
  //   factory.getTrends(user).then(function(response) {
  //     expect(response).toBeDefined();
  //     expect(response).toEqual(testData);
  //   });
  // });

  it('should format a list of tweets with hashtags and URLs', function () {
    var url = baseUrl + '/tweetapp/auth/analysis/user/165697756';
    var testData = 'How to optimise your code and make it run faster. https://t.co/sB1G7ynH2j. #javascript #javascript';
    httpBackend.whenGET('165697756').respond(testData);
    factory.getTrends(user).then(function(response) {
      expect(response).toBeDefined();
      expect(response.data).not.toEqual(testData);
    });
  });

});

describe("userFactory", function () {
  var factory, httpBackend, baseUrl = 'http://localhost:3001', user = {user_id: "165697756", screen_name: "systemick", _id: "54d743f9ae838cbd6266cd38"};

  beforeEach(module("twitterapp"));

  beforeEach(inject(function (userFactory, $httpBackend) {
    factory = userFactory;
    httpBackend = $httpBackend;
  }));

  it('has functions', function () {
    expect(factory.sendLoginData).toBeDefined();
    expect(factory.userSessionData).toBeDefined();
    expect(factory.userTwitterData).toBeDefined();
  });
});

describe('loginCtrl', function () {
  var scope, location, createController;

  beforeEach(module("twitterapp"));

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();

    createController = function() {
      return $controller('loginCtrl', {
        '$scope': scope,
      });
    };
  }));

  it('has login ctrl variables', function () {
    var controller = createController();
    expect(scope.formSuccess).toBeFalsy();
    expect(scope.formSubmitError).toBeFalsy();
    expect(scope.twitterLoginUrl).toBeDefined();
  });
});

describe('loginCallbackCtrl', function () {
  var scope, location, createController;

  beforeEach(module("twitterapp"));

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();

    createController = function() {
      return $controller('loginCallbackCtrl', {
        '$scope': scope,
      });
    };
  }));

  it('has login callback ctrl variables', function () {
    var controller = createController();
    expect(scope.tweetapp).toBeDefined();
  });
});