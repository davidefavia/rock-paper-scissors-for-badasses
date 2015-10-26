// Karma configuration
module.exports = function(config) {
  config.set({
    basePath: '',
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-jasmine-html-reporter'
    ],
    frameworks: ['jasmine'],
    files: [
      "bower_components/angular/angular.min.js",
      "bower_components/angular-route/angular-route.min.js",
      "bower_components/angular-mocks/angular-mocks.js",
      "src/js/app.js",
      "test/*.spec.js"
    ],
    reporters: ['dots', 'progress', 'html'],
    port: 9876,
    colors: true,
    // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,
    autoWatch: false,
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
}
