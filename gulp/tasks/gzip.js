var gulp   = require('gulp');
var gzip   = require("gulp-gzip");
var pkg    = require('../../package.json');

gulp.task('gzip', function() {

	var file         = pkg.folders.dest+'/js/vendor/modernizr-custom.js';
	var pathSegments = file.split('/');
	pathSegments.pop();
	var fileTarget   = pathSegments.join('/');

	return gulp.src(file)
		.pipe(gzip({append: false}))
		.pipe(gulp.dest(fileTarget));
		
});