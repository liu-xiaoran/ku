var gulp = require('gulp');
var tinypng = require('gulp-tinypng-compress');
 
gulp.task('tinypng', function () {
    gulp.src('./../*.{png,jpg,jpeg}')
        .pipe(tinypng({
            key: '4G1XPIf1F3CONl9i1nZ5ArnAkho2MbKt',
            sigFile: './',
            log: true
        }))
        .pipe(gulp.dest('./../'));
});
gulp.task('default',['tinypng'])