var gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify'),
    gp_sourcemaps = require('gulp-sourcemaps'),
    minifyCSS = require('gulp-minify-css');

gulp.task('js-to-header', function(){
    return gulp.src([
            './lib/kendoui/js/jquery.min.js',       //jQuery JavaScript
            './lib/kendoui/js/kendo.all.min.js',    //Kendo UI combined JavaScript
        ])
        .pipe(gp_sourcemaps.init())
        .pipe(gp_concat('header_script.concat.js'))
        .pipe(gulp.dest('js'))
        .pipe(gp_rename('header_script.min.js'))
        .pipe(gp_uglify())
        .pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest('js'));
});

gulp.task('js-to-bottom', function(){
    return gulp.src([
            './_source/js/models.js',
            './_source/js/models.js',
            './_source/js/route.js',
            './_source/js/main.js',
            './lib/fancybox/jquery.fancybox.pack.js',
            './lib/malihu-custom-scrollbar/jquery.mCustomScrollbar.concat.min.js'
        ])
        .pipe(gp_sourcemaps.init())
        .pipe(gp_concat('bottom_script.concat.js'))
        .pipe(gulp.dest('js'))
        .pipe(gp_rename('bottom_script.min.js'))
        .pipe(gp_uglify())
        .pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest('js'));
});

gulp.task('css', function(){
    gulp.src([
            './lib/kendoui/styles/kendo.common.min.css',                        //Common Kendo UI CSS for web and dataviz widgets
            './lib/fancybox/jquery.fancybox.css',                               //fancybox
            './lib/malihu-custom-scrollbar/jquery.mCustomScrollbar.min.css',    //to customize scrollbars
            './_source/styles/*.css'                                            //my styles
        ])
        .pipe(gp_sourcemaps.init())
        .pipe(gp_concat('main.concat.css'))
        .pipe(gulp.dest('styles'))
        .pipe(gp_rename('main.min.css'))
        .pipe(minifyCSS())
        .pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest('styles'))
});

gulp.task('default', ['js-to-header', 'js-to-bottom', 'css'], function(){});
