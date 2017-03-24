//import everything
var g               = require('gulp');
var sass            = require('gulp-sass');
var cleanCss        = require('gulp-clean-css');
var prefix          = require('gulp-autoprefixer');
var uglify          = require('gulp-uglify');
var concat          = require('gulp-concat');
var htmlmin         = require('gulp-htmlmin');
var imgmin          = require('gulp-imagemin');
var watch           = require('gulp-watch');
var plumber         = require('gulp-plumber');
var removeComm      = require('gulp-remove-html-comments');
var clean           = require('gulp-clean');
var httpProxy       = require('http-proxy');
var browserSync     = require('browser-sync');
var connect         = require('gulp-connect-php');

//delete dist folder
g.task('clean', function () {
    return g.src('dist', {read: false})
        .pipe(clean());
});

//remove comments from php and html documents
g.task('removeComm', function () {
    return g.src(['app/**/*.php','app/**/*.html'])
        .pipe(plumber())
        .pipe(removeComm())
        .pipe(g.dest('dist/'));
});

//minify html and php files
g.task('minify', ['removeComm'] , function(){
    return g.src(['app/**/*.php' ,'app/**/*.html'])
        .pipe(plumber())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(g.dest('dist'));
});

//convert scss to css and add prefixes
g.task('compile-sass', function () {
    return g.src('app/scss/app.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(prefix('last 2 versions'))
        .pipe(g.dest('app/css'));
});

//minify css files and run the sass function before
g.task('css-build', ['compile-sass'], function() {
    return g.src('app/css/*.css')
        .pipe(plumber())
        .pipe(cleanCss({compatibility: 'ie8'}))
        .pipe(g.dest('dist/css'));
});

//creating app.js from all js files in the app folder
g.task('concat-jss',function () {
    return g.src('app/js/app/*.js)')
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(g.dest('app/js'))
});

//create impots.js from all js files in imporst folder
g.task('concat-js', ['concat-jss'] ,function () {
    return g.src('app/js/third_party/*.js')
        .pipe(plumber())
        .pipe(concat('third_party.js'))
        .pipe(g.dest('app/js'))
});

//uglify all flies
g.task('js-build', ['concat-js','concat-js'] , function () {
    return g.src('app/js/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(g.dest('dist/js'))
});

//copy img and .htaccess files to dist folder
g.task('copy', function() {
    return g.src(['app/.htaccess', 'app/config.ini'])
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

g.task('connect-php', function () {
    connect.server({
        port: 8079,
        base: 'app',
        open: false
    });

    var proxy   = httpProxy.createProxyServer({});
    var reload  = browserSync.reload;

    browserSync({
        notify: false,
        port  : 8079,
        server: {
            baseDir   : ['app'],
            middleware: function (req, res, next) {
                var url = req.url;

                if (!url.match(/^\/(css)\//)) {
                    proxy.web(req, res, { target: 'http://localhost:8079' });
                } else {
                    next();
                }
            }
        }
    });

    g.watch([
        'app/*.html',
        'app/*.php',
        'app/js/*.js',
        'app/css/app.css',
        'app/img/**/*'
    ]).on('change', reload);

    g.watch('app/scss/*scss',     ['compile-sass']);
    g.watch('app/js/**/*.js',     ['concat-js']);

});

g.task('build',['clean'],function () {
    g.start('minify', 'css-build', 'js-build', 'copy', 'imgmin')
});

//run css tole to compile css
g.task('default', ['compile-sass', 'concat-js']);