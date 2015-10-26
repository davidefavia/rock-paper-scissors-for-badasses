var concat = require('gulp-concat');
var connect = require('gulp-connect');
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var gutils = require('gutils');
var inject = require('gulp-inject');
var karmaServer = require('karma').Server;
var less = require('gulp-less');
var merge = require('merge-stream');
var minifycss = require('gulp-minify-css');
var runsequence = require('run-sequence');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

var src = {
  folder: 'src/',
  main: 'src/index.html',
  less: [
    'src/less/*.less',
    '!src/less/_*.less'
  ],
  js: 'src/js/app.js',
  folders : ['src/**', '!src/js/*.*', '!src/css/*.*'],
  bower: {
    js: [
      'bower_components/angular/angular.min.js',
      'bower_components/angular-route/angular-route.min.js'
    ],
    css: [
      'bower_components/bootstrap/dist/css/bootstrap.min.css'
    ]
  }
};
var dest = {
  folder: 'build/',
  main: 'build/index.html',
  js: 'build/js/',
  css: 'build/css/'
}

// noop for default task
gulp.task('default', gutils.noop);

// clean 'build' folder
gulp.task('clean', function(cb) {
  del(dest.folder).then(function() {
    cb();
  });
});

// move bower files to 'build' folder
gulp.task('bower', function() {
  fs.mkdirSync(dest.folder);
  var js = gulp.src(src.bower.js.concat(src.js))
    .pipe(gulp.dest(dest.js));
  var css = gulp.src(src.bower.css)
    .pipe(gulp.dest(dest.css));
  var folders = gulp.src(src.folders)
    .pipe(gulp.dest(dest.folder));
  var html = gulp.src(src.main)
    .pipe(gulp.dest(dest.folder));
  return merge(js, css, folders, html);
});

// inject css and js files into index.html
gulp.task('html', function() {
  return gulp.src(src.main).pipe(inject(gulp.src([
    dest.js + 'angular.min.js',
    dest.js + '*.js',
    dest.css + 'bootstrap.min.css',
    dest.css + '*.css',
  ]), {
    relative: false,
    ignorePath : dest.folder,
    addRootSlash : false
  }))
  .pipe(gulp.dest(dest.folder));
});

// build folder to be served
gulp.task('build', function(cb) {
  return runsequence('clean', 'bower', 'less', 'html', function() {
    cb();
  });
});

// compile css and javascript for distribution, remove useless files and folders
gulp.task('pre', function(cb) {
  return runsequence('compile', 'useless', cb);
});

// uglify app.js
// @TODO investigate why minification lead to error when using $routeProvider
gulp.task('uglify', function() {
  return gulp.src(dest.js + 'app.js')
  .pipe(uglify({
    mangle : true
  }))
  .pipe(gulp.dest(dest.js));
});

// compile css and javascript
gulp.task('compile', function() {
  var css = gulp.src([
    dest.css + 'bootstrap.min.css',
    dest.css + '*.css',
  ])
  .pipe(concat('app.min.css'))
  .pipe(gulp.dest(dest.css));
  var js = gulp.src([
    dest.js + 'angular.min.js',
    dest.js + 'angular-*.js',
    dest.js + '*.js'
  ])
  .pipe(concat('app.min.js'))
  .pipe(gulp.dest(dest.js));
  return merge(css, js);
});

// remove useless files and folders
gulp.task('useless', function(cb) {
  del([
    dest.css + '*.css',
    '!' + dest.css + 'app.min.css',
    dest.js + '*.js',
    '!' + dest.js + 'app.min.js',
    dest.folder + 'less'
  ]).then(function() {
    cb();
  })
});

// compile less files and reload
gulp.task('less', function() {
  return gulp.src(src.less)
    .pipe(less())
    .pipe(minifycss())
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest(dest.css))
    .pipe(connect.reload());
});

// move javascript file and reload
gulp.task('js', function() {
  return gulp.src(src.js)
    .pipe(gulp.dest(dest.js))
    .pipe(connect.reload());
});

// move folders and reload
gulp.task('folders', function() {
  return gulp.src(src.folders)
    .pipe(gulp.dest(dest.folder))
    .pipe(connect.reload());
});

// watch source files and folders
gulp.task('watch', function(cb) {
  var list = [
    src.folder + 'src/*.*',
    src.folder + 'src/**'
  ];
  watch(list, function(vinyl) {
    var newPath = vinyl.path.split('src').join('build');
    var type = vinyl.event;
    if (type === 'unlink') {
      // @TODO better approach?
      fs.unlinkSync(newPath);
    } else {
      fs.createReadStream(vinyl.path).pipe(fs.createWriteStream(newPath));
    }
    gulp.src(list)
      .pipe(watch(list))
      .on('end', cb);
  });
  gulp.watch(src.less, ['less']);
  gulp.watch(src.js, ['js']);
  gulp.watch(src.folders, ['folders', 'reload']);
  gulp.watch(src.main, ['reload']);
});

// reload
gulp.task('reload', ['html'], function() {
  return gulp.src(dest.main)
    .pipe(connect.reload());
});

// serve (after build) with watch
gulp.task('serve', ['build'], function() {
  gulp.start('watch');
  connect.server({
    root: dest.folder,
    port: 12345,
    livereload: true
  });
});

// prepare folder to be distribted
gulp.task('dist', function(cb) {
  return runsequence('clean', 'bower', 'less', 'pre', 'html', cb);
});


// run tests
gulp.task('test', function (cb) {
  new karmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, cb).start();
});
