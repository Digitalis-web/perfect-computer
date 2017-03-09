//import everything
var g           = require('gulp');
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
var clean       = require('gulp-clean');

//delete dist folder
g.task('delete', function () {
    return g.src('dist', {read: false})
        .pipe(clean());
});

//remove comments from php and html documents
g.task('removeComm', function () {
    return g.src('app/**/*.php')
        .pipe(removeComm())
        .pipe(g.dest('dist/'));
});

//minify html and php files
g.task('minify', ['removeComm'] , function() {
    return g.src(['app/**/*.php' ,'app/**/*.html'])
        .pipe(plumber())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(g.dest('dist'));
});

//convert scss to css and add prefixes
g.task('sass', function () {
    return g.src('app/scss/app.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(prefix('last 2 versions'))
        .pipe(g.dest('app/css'));
});

//minify css files and run the sass function before
g.task('minify-css', ['sass'], function() {
    return g.src('app/css/*.css')
        .pipe(plumber())
        .pipe(cleanCss({compatibility: 'ie8'}))
        .pipe(g.dest('dist/css'));
});

//uglify and concat some files
g.task('scripts', function () {
    return g.src(['app/js/app.js'])
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(g.dest('dist/js'))
});

//uglify all flies
g.task('scripts', function () {
    return g.src('app/js/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(g.dest('dist/js'))
});

//copy img and .htaccess files to dist folder
g.task('copy', function() {
    return g.src('app/.htaccess')
        .pipe(plumber())
        .pipe(g.dest('dist'));
});

//compress all images from app folder
g.task('imgmin', function () {
    return g.src('app/img/**/*')
        .pipe(plumber())
        .pipe(imgmin())
        .pipe(g.dest('dist/img'));
});

// watch for file changes and performs the different tasks
g.task('watch', function () {
    g.watch('app/js/*js',         ['scripts']);
    g.watch('app/scss/*scss',     ['minify-css']);
    g.watch('app/**/*{html,php}', ['minify']);
    g.watch('app/img/**/*',       ['imgmin']);
    g.watch('app/.htaccess',      ['copy']);
});

g.task('build', ['minify-css', 'minify', 'scripts', 'imgmin', 'copy', 'watch']);

g.task('default', ['build']);