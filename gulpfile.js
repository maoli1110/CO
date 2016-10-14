var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');

var paths = {
    js: [
        './modules/core/*.js',
        './modules/core/**/*.js',
        './modules/cooperation/*.js',
        './modules/cooperation/**/*.js',
        './modules/manage/*.js',
        './modules/manage/**/*.js'
    ],
    css: [
        './css/style.css',
        './css/goods.css',
        './css/cooperation.css',
        './css/main.css'
    ]
};

gulp.task('scripts', function () {
    return gulp.src(paths.js)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./build'))
        .pipe(rename('all.min.js'))
        .pipe(uglify({mangle: false}).on('error', function(e) { console.log('\x07',e.message); return this.end(); }))
        .pipe(gulp.dest('./build'));
});
gulp.task('css', function () {
    return gulp.src(paths.css)
        .pipe(minifyCSS())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest('./build'));
});

gulp.task('default', ['scripts', 'css']);