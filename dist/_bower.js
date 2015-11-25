var fs = require('fs');
var args = require('minimist')(process.argv.slice(2));
var browserify = require('browserify');

var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var wrap = require('gulp-wrap');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var transform = require('vinyl-transform');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var pkg = require('./package.json');

gulp.task('default', [ 'test', 'build' ]);

gulp.task('test', function() {
  return gulp.src('test/*.js', {
    read : false
  }).pipe(mocha({}));
});

gulp.task('build', [ 'web', 'cordova' ]);
gulp.task('web', dist([ './platform/web' ], 'web'));
gulp.task('cordova', dist([ './platform/cordova' ], 'cordova'));

gulp.task('build-nomin', [ 'web-nomin', 'cordova-nomin' ]);
gulp.task('web-nomin', dist([ './platform/web' ], 'web', true));
gulp.task('cordova-nomin', dist([ './platform/cordova' ], 'cordova', true));

(function(tasks) {
  gulp.task('dev', tasks.concat([ 'watch-dev' ]));
  gulp.task('watch-dev', function() {
    gulp.watch('{lib/**/*.js,platform/**/*.js}', tasks);
  });
})([ 'web-nomin' /* , 'cordova-nomin' */]);

function dist(files, file, nomin) {
  return function() {
    var task = browserify({
      entries : files,
      standalone : 'Stage'
    });
    task = task.transform({
      fromString : true,
      compress : false,
      mangle : false,
      output : {
        beautify : true,
        comments : /^((?!@license)[\s\S])*$/i
      }
    }, 'uglifyify');
    task = task.bundle();
    task.on('error', function(err) {
      console.log(gutil.colors.red(err.message));
      this.emit('end');
    });
    task = task.pipe(source('stage.' + file + '.js')).pipe(buffer()); // vinylify
    task = task.pipe(wrap({
      src : 'template/dist.js'
    }, {
      version : pkg.version
    }));
    task = task.pipe(gulp.dest('dist'));
    if (!nomin) {
      task = task.pipe(rename('stage.' + file + '.min.js'));
      task = task.pipe(uglify({
        output : {
          comments : /@license/i
        }
      }));
      task = task.pipe(gulp.dest('dist'));
    }
    return task;
  };
}