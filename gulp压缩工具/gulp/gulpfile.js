var gulp = require('gulp');
var tinypng = require('gulp-tinypng-compress');
 
gulp.task('tinypng', function () {
    gulp.src('./../*.{png,jpg,jpeg}')
        .pipe(tinypng({
            key: '_AWkY1qP_WlaPIF3yea_4d_pf1jxCNUH',
            sigFile: './',
            log: true
        }))
        .pipe(gulp.dest('./../'));
});
gulp.task('default',['tinypng'])