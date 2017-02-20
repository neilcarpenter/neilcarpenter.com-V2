var gulp         = require('gulp');
var compass      = require('gulp-compass');
var prefix       = require('gulp-autoprefixer');
var minifyCSS    = require('gulp-minify-css');
var cmq          = require('gulp-combine-media-queries');
var gutil        = require('gulp-util');
var gzip         = require("gulp-gzip");
var rimraf       = require('gulp-rimraf');
var handleErrors = require('../util/handleErrors');
var pkg          = require('../../package.json');

gulp.task('_resetCSS', function () {

    return gulp.src(pkg.folders.dest+'/css/main.css')
        .pipe(rimraf());

});

gulp.task('sass', ['_resetCSS', 'images'], function () {

	return gulp.src(pkg.folders.src+'/sass/main.scss')
		.pipe(compass({
            css   : pkg.folders.dest+'/css',
            sass  : pkg.folders.src+'/sass/',
            image : pkg.folders.dest+'/static/img/'
        }))
		.on('error', handleErrors)
		.pipe(prefix("ie >= 8", "ff >= 3", "safari >= 4", "opera >= 12", "chrome >= 4"))
		.pipe(global.isWatching ? gutil.noop() : cmq())
		// .pipe(global.isWatching ? gutil.noop() : minifyCSS())
		.pipe(gzip({append: false}))
		// issue here using pkg.folders.dest+'/css' - just hardcode
		.pipe(gulp.dest('resonate-2015/css'));

});
