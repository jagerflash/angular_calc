var gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    minifyCSS = require('gulp-clean-css'),
    renameCSS = require('gulp-rename'),
    less = require('gulp-less'),
    uglifly = require('gulp-uglyfly'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    merge = require('merge-stream');
    watch = require('gulp-watch');

gulp.task('lint', function() {
  return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task('make_js', function() {
  return gulp.src('js/*js')
    .pipe(uglifly())
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest('js'))
});

gulp.task('make_less', function () {
  var lessStream = gulp.src('less/*.less')
    .pipe(less())
    .pipe(gulp.dest('css/styles'));
  var cssStream = gulp.src('css/styles/*.css')
      .pipe(concat('css-files.css'))
  ;
    
  return merge(lessStream, cssStream)
    .pipe(concatCss("style.css"))
    .pipe(minifyCSS())
    .pipe(renameCSS('style.min.css'))
    .pipe(gulp.dest('css/'))
  ;
});
 
gulp.task('default', ['make_less' ,'make_js']);

gulp.task('watch', function() {
  return  gulp.watch('js/*.js', ['make_js']);
});