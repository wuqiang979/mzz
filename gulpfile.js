const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('default', () => {
    gulp.watch('./scss/**/*.scss', () => {
        console.log('转换成功')
        gulp.src('./scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['> .5% or last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./style'));
    });
});