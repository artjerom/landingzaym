var gulp = require('gulp'),
    connect = require('gulp-connect'),
    jade = require('gulp-jade'),

    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    csso = require('gulp-csso'),
    rename = require('gulp-rename'),

    browserify = require('browserify'),
    babelify = require('babelify');
    minify = require('gulp-minify'),
    jshint = require('gulp-jshint'),
    source = require('vinyl-source-stream'),

    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    jpegtran = require('imagemin-jpegtran'),
    concat = require('gulp-concat'),

    notify = require('gulp-notify'),
    fs = require('fs');

gulp.task('connect', function () {
   return connect.server({
       port: 3000,
       livereload: true,
       root: './public'
   });
});

gulp.task('jade', function() {
    return gulp.src('dev/jade/index.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./public/'))
        .pipe(connect.reload());
});


gulp.task('styles', function() {
    var processors = [
        autoprefixer({browsers: ['last 2 versions']})
    ];

    return gulp.src('./dev/css/main.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./public/css/'))
        .pipe(notify('Styles task completed'))
        .pipe(connect.reload());
});

gulp.task('scripts', function() {

    browserify('dev/js/app.js', {entries: 'dev/js/app.js', debug: true})
        .transform(babelify, {
            presets: ['es2015'],
            plugins: ['transform-class-properties']
        })
        .bundle()
        .pipe(source('app.js'))
        .pipe(jshint())
        .pipe(gulp.dest('public/js/'))
        .pipe(notify('Scripts task completed'))
        .pipe(connect.reload());
});

gulp.task('styles-minify', function() {

    var processors = [
        autoprefixer({browsers: ['last 2 versions']})
    ];

    return gulp.src('./dev/css/style.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(csso())
        .pipe(rename('styles-min.css'))
        .pipe(gulp.dest('./public/css/'))
        .pipe(notify('Styles-minify task completed'));
});

gulp.task('scripts-minify', function() {

    return gulp.src('public/js/app.js')
        .pipe(minify())
        .pipe(gulp.dest('public/js/'))
        .pipe(notify('Scripts-minify task completed'));
});

gulp.task('images', function(){

    return gulp.src('./dev/img/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant(), jpegtran()]
        }))
        .pipe(gulp.dest('./public/img'));
});

// Копирование шрифтов в public
gulp.task('fonts', function () {
    return gulp.src('./dev/fonts/*/*')
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('external', function(){
    var processors = [
        autoprefixer({browsers: ['last 2 versions']})
    ];

    gulp.src(['./dev/external/*.css'])
        .pipe(concat('external.css'))
        .pipe(postcss(processors))
        .pipe(csso())
        //.pipe(rename('external.css'))
        .pipe(gulp.dest('./public/external/'));

    gulp.src(['./dev/external/*.js'])
        .pipe(concat('external.js'))
        .pipe(minify())
        .pipe(gulp.dest('./public/external/'));

    gulp.src('./dev/external/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant(), jpegtran()]
        }))
        .pipe(gulp.dest('./public/external/'));
});

gulp.task('default', ['styles', 'scripts', 'jade', 'connect'], function() {
    gulp.watch('./dev/jade/**/*.jade', ['jade']);
    gulp.watch('./dev/css/**/*.scss', ['styles']);
    gulp.watch('./dev/js/**/*.js', ['scripts']);
});

gulp.task('build', ['styles', 'scripts', 'images', 'external', 'fonts', 'jade']);