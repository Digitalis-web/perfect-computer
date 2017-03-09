//import everything
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var cleanCss    = require('gulp-clean-css');
var prefix      = require('gulp-autoprefixer');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var htmlmin     = require('gulp-htmlmin');
var imgmin      = require('gulp-imagemin');
var watch       = require('gulp-watch');
var plumber     = require('gulp-plumber');
var removeComm  = require('gulp-remove-html-comments');

//remove comments from php and html documents
gulp.task('removeComm', function () {
    return gulp.src('app/**/*.php')
        .pipe(removeComm())
        .pipe(gulp.dest('dist/'));
});

//minify html and php files
gulp.task('minify', ['removeComm'] , function() {
    return gulp.src(['app/**/*.php' ,'app/**/*.html'])
        .pipe(plumber())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
});

//convert scss to css and add prefixes
gulp.task('sass', function () {
    return gulp.src('app/scss/app.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(prefix('last 2 versions'))
        .pipe(gulp.dest('app/css'));
});

//minify css files and run the sass function before
gulp.task('minify-css', ['sass'], function() {
    return gulp.src('app/css/*.css')
        .pipe(plumber())
        .pipe(cleanCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/css'));
});

//uglify and concat some files
gulp.task('scripts', function () {
    return gulp.src(['app/js/app.js'])
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

//uglify all flies
gulp.task('scripts', function () {
    return gulp.src('app/js/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

//coppy img and .htaccess files to dist folder
gulp.task('copy', function() {
    return gulp.src('app/.htaccess')
        .pipe(plumber())
        .pipe(gulp.dest('dist'));
});

//compress all images from app folder
gulp.task('imgmin', function () {
    return gulp.src('app/img/**/*')
        .pipe(plumber())
        .pipe(imgmin())
        .pipe(gulp.dest('dist/img'));
});

// watch for file changes and performs the different tasks
gulp.task('watch', function () {
    gulp.watch('app/js/*js',         ['scripts']);
    gulp.watch('app/scss/*scss',     ['minify-css']);
    gulp.watch('app/**/*{html,php}', ['minify']);
    gulp.watch('app/img/**/*',       ['imgmin']);
    gulp.watch('app/.htaccess',      ['copy']);
});

// Run everything
gulp.task('default', ['minify-css', 'minify', 'scripts', 'imgmin', 'copy', 'watch']);