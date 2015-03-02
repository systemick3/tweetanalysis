// Karma configuration
// Generated on Thu Dec 11 2014 12:06:38 GMT+0000 (GMT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-loader/angular-loader.js',
      'app/bower_components/angular-cookie/angular-cookie.js',
      'app/bower_components/socket.io-client/socket.io.js',
      'app/bower_components/angular-socket-io/socket.js',
      'app/app.js',
      'app/components/about/aboutDirectives.js',
      'app/components/analysis/analysisDirectives.js',
      'app/components/analysis/analysisServices.js',
      'app/components/analysis/analysisControllers.js',
      'app/components/chart/chartDirectives.js',
      'app/components/chart/chartServices.js',
      'app/components/chart/chartServices.js',
      'app/components/contact/contactServices.js',
      'app/components/contact/contactServices.js',
      'app/components/contact/contactControllers.js',
      'app/components/home/homeControllers.js',
      'app/components/tweet/tweetServices.js',
      'app/components/tweet/tweetServices.js',
      'app/components/tweet/tweetControllers.js',
      'app/components/user/userControllers.js',
      'app/components/user/userServices.js',
      'app/components/vendor/ng-infinite-scroll.min.js',
      'test/test.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
