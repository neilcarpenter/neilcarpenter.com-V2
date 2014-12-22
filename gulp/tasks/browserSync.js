var browserSync = require('browser-sync');
var gulp        = require('gulp');
var fs          = require('fs');
var pkg         = require('../../package.json');

gulp.task('browserSync', ['build'], function() {
  browserSync.init([pkg.folders.dest+'/**'], {
    proxy: "local.resonate15:8888"
  });
});