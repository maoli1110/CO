var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var currentUnix = new Date().getTime();
var paths = {
    js: [
        './modules/core/*.js',
        './modules/core/**/*.js',
        './modules/cooperation/*.js',
        './modules/cooperation/**/*.js',
        './modules/manage/*.js',
        './modules/manage/**/*.js',
        './lib/jquery.scrollLoading.js'
    ],
    css1: [
        './css/main.css'
    ]
};

gulp.task('scripts', function () {
    return gulp.src(paths.js)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./release'))
        .pipe(rename('all.min.js'))
        .pipe(uglify({mangle: false}).on('error', function(e) { console.log('\x07',e.message); return this.end(); }))
        .pipe(gulp.dest('./release'));
});
gulp.task('css1', function () {
    return gulp.src(paths.css1)
        .pipe(minifyCSS())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('./release'));
});
gulp.task('default', ['scripts','css1']);