var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', function() {

    var args = [
        ['browserify', 'vendor'],
    ];

    runSequence.apply(this, args);

});
