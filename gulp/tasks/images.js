var changed  = require('gulp-changed');
var gulp     = require('gulp');
var imagemin = require('gulp-imagemin');
var gzip     = require("gulp-gzip");
var pngcrush = require('imagemin-pngcrush');
var pkg      = require('../../package.json');

gulp.task('_svgGzip', function() {
	
	var dest = pkg.folders.dest+'/static/img';

	return gulp.src(pkg.folders.src+'/img/**/*.svg')
		.pipe(gzip({append: false}))
		.pipe(gulp.dest(dest));

});

gulp.task('images', ['_svgGzip'], function() {
  
  var dest = pkg.folders.dest+'/static/img';

	return gulp.src(pkg.folders.src+'/img/**/*.{png,jpg,gif}')
		.pipe(changed(dest))
		.pipe(imagemin())
		.pipe(gulp.dest(dest));

});
