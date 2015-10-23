var connect = require('gulp-connect');
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var gutils = require('gutils');
var inject = require('gulp-inject');
var less = require('gulp-less');
var merge = require('merge-stream');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var runsequence = require('run-sequence');
var karmaServer = require('karma').Server;
var watch = require('gulp-watch');

var src = {
  folder: 'src/',
  main: 'src/index.html',
  less: 'src/less/*.less',
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

gulp.task('default', gutils.noop);

gulp.task('clean', function(cb) {
  del(dest.folder).then(function() {
    cb();
  });
});

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

gulp.task('build', function(cb) {
  return runsequence('clean', 'bower', 'less', 'html', function() {
    cb();
  });
});

gulp.task('less', function() {
  return gulp.src(src.less)
    .pipe(less())
    .pipe(minifycss())
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest(dest.css))
    .pipe(connect.reload());
});

gulp.task('js', function() {
  return gulp.src(src.js)
    .pipe(gulp.dest(dest.js))
    .pipe(connect.reload());
});

gulp.task('folders', function() {
  return gulp.src(src.folders)
    .pipe(gulp.dest(dest.folder))
    .pipe(connect.reload());
});

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

gulp.task('reload', ['html'], function() {
  return gulp.src(dest.main)
    .pipe(connect.reload());
});


gulp.task('serve', ['build'], function() {
  gulp.start('watch');
  connect.server({
    root: dest.folder,
    port: 12345,
    livereload: true
  });
});

gulp.task('test', function (cb) {
  new karmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, cb).start();
});
