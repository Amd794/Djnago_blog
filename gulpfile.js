var gulp = require("gulp");
var cssnano = require("gulp-cssnano");
var cssmin = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var bs = require('browser-sync').create();
var sass = require('gulp-sass');
var util = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');

var path = {
    'html': './templates/**/',  // **代表任意文件夹
    'src': {
        'css': './static/css/src/css/**/',
        'scss': './static/css/src/scss/**/',
        'js': './static/js/src/**/',
        'images': './static/images/src/',
    },
    'dist': {
        'css': './static/css/dist/',
        'js': './static/js/dist/',
        'images': './static/images/dist/',

    }
};

// 定义一个html任务
gulp.task('html', function () {
    gulp.src(path.html + '*.html')
        .pipe(bs.stream())
});

//  定义一个css处理任务
gulp.task('scss', function () {
    gulp.src(path.src.scss + '*.scss')
        .pipe(sass().on("error", util.log))
        .pipe(cssnano())
        .pipe(rename({'suffix': '.min'}))
        .pipe(gulp.dest(path.dist.css))
        .pipe(bs.stream())
});


//  定义一个css处理任务
gulp.task('css', function () {
    gulp.src(path.src.css + '*.css')
        .pipe(cssnano())
        .pipe(rename({'suffix': '.min'}))
        .pipe(gulp.dest(path.dist.css))
        .pipe(bs.stream())
});

// 定义一个处理js的任务
gulp.task('js', function () {
    gulp.src(path.src.js + '*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify(
            {
                compress:{
                    'drop_console': false,
                },//类型：Boolean 默认：true 是否完全压缩
            }
        ))
        .pipe(rename({'suffix': '.min'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.js))
        .pipe(bs.stream())
});

// 定义一个处理图片的任务
gulp.task('images', function () {
    gulp.src(path.src.images + '*.*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(path.dist.images))
        .pipe(bs.stream())
});

// 定义监听文件修改的任务
gulp.task('watch', function () {
    gulp.watch(path.html + '*.html', ['html']);
    gulp.watch(path.src.css + '*.scss', ['scss']);
    gulp.watch('./static/css/src/css/' + '*.css', ['css']);
    gulp.watch(path.src.js + '*.js', ['js']);
    gulp.watch(path.src.images + '*.*', ['images']);
});

// 初始化browser-sync的参数
gulp.task('bs', function () {
    bs.init({
        'server': {
            'baseDir': './'
        }
    });
});

// 创建一个默认任务
// gulp.task('default', ['bs', 'watch']);
gulp.task('default', ['watch']);