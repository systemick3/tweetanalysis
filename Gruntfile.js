module.exports = function(grunt) {

  // TODO:
  // Get this to work
  // The console complains that controllers/directives are missing
  // when the custom code in concatted and minified

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [ 'app/bower_components/jquery/dist/jquery.js', 'app/bower_components/angular/angular.js', 
        'app/bower_components/angular-route/angular-route.js', 'app/bower_components/angular-cookie/angular-cookie.js',
        'app/bower_components/socket.io-client/socket.io.js', 'app/bower_components/angular-socket-io/socket.js',
        'app/bower_components/angular-sanitize/angular-sanitize.js', 'app/bower_components/angular-animate/angular-animate.js',
        'app/bower_components/chartjs/Chart.js', 'app/components/vendor/ng-infinite-scroll.min.js', 'app/app.js',
        'app/components/user/userServices.js', 'app/components/user/userControllers.js', 'app/components/home/homeControllers.js',
        'app/components/contact/contactServices.js', 'app/components/contact/contactDirectives.js', 'app/components/contact/contactControllers.js',
        'app/components/about/aboutDirectives.js', 'app/components/about/aboutControllers.js', 'app/components/chart/chartServices.js',
        'app/components/chart/chartDirectives.js', 'app/components/analysis/analysisServices.js', 'app/components/analysis/analysisDirectives.js',
        'app/components/analysis/analysisControllers.js', 'app/components/tweet/tweetServices.js', 'app/components/tweet/tweetDirectives.js',
        'app/components/tweet/tweetControllers.js', 'app/components/version/version.js', 'app/components/version/version-directive.js',
        'app/components/version/interpolate-filter.js' ],
        src: [ 'app/components/user/userServices.js', 'app/components/user/userControllers.js', 'app/components/home/homeControllers.js',
        'app/components/contact/contactServices.js', 'app/components/contact/contactDirectives.js', 'app/components/contact/contactControllers.js',
        'app/components/about/aboutDirectives.js', 'app/components/about/aboutControllers.js', 'app/components/chart/chartServices.js',
        'app/components/chart/chartDirectives.js', 'app/components/analysis/analysisServices.js', 'app/components/analysis/analysisDirectives.js',
        'app/components/analysis/analysisControllers.js', 'app/components/tweet/tweetServices.js', 'app/components/tweet/tweetDirectives.js',
        'app/components/tweet/tweetControllers.js', 'app/components/version/version.js', 'app/components/version/version-directive.js',
        'app/components/version/interpolate-filter.js' ],
        dest: 'app/alljs.js'
      }
    },
    ngAnnotate: {
      dist: {
          files: {
            'app/alljsWithAnnotations.js': ['app/alljs.js']
          },
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      dist: {
        src: 'app/alljsWithAnnotations.js',
        dest: 'app/alljs.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('package', [ 'concat:dist', 'ngAnnotate:dist', 'uglify:dist' ]);

};