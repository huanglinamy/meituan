var gulp = require('gulp');
var sass = require('gulp-sass');
var minCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var server = require('gulp-webserver');
var url = require('url');
var fs = require('fs');
var path = require('path');

//编译scss 压缩css
gulp.task('devCss', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(minCss())
        .pipe(gulp.dest('./src/css'))
});

//监听scss
gulp.task('watch', function() {
    return gulp.watch('./src/scss/*.scss', gulp.parallel('devCss'))
});

//开发环境---gulp启服务
gulp.task('devServer', function() {
    return gulp.src('src')
        .pipe(server({
            port: 8899,
            open: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    res.end('');
                    return;
                }
                //接口访问
                if (pathname === '/api/swiper') {

                }
                //文件访问
                pathname = pathname === '/' ? 'web.html' : pathname;
                res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));

            }
        }))
});

//开发环境----整合任务
gulp.task('dev', gulp.series('devCss', 'devServer', 'watch'));



//线上环境----打包
//js
gulp.task('buildJs', function() {
    return gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
});
//css
gulp.task('buildCss', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(minCss())
        .pipe(gulp.dest('./build/css'))
});
//js下的libs
gulp.task('copyLibs', function() {
    return gulp.src('./src/js/libs/*.js')
        .pipe(gulp.dest('build/js/libs'))
});
//html
gulp.task('copyHtml', function() {
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('build'))
});
//imgs
gulp.task('copyImgs', function() {
    return gulp.src('./src/imgs/*')
        .pipe(gulp.dest('./build/imgs'))
});

//线上环境
gulp.task('build', gulp.series('buildJs', 'buildCss', 'copyLibs', 'copyHtml', 'copyImgs'));