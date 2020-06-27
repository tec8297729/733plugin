const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify'); // 读取ts配置
const watchify = require('watchify');
const uglify = require('gulp-uglify'); // 混淆
const cleanDir = require('gulp-clean');
// sourcemaps
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const config = require('./config/config');

const watchedBrowserify = watchify(
  browserify({
    basedir: '.',
    debug: config.isDebug,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {},
  }).plugin(tsify)
);

// 生产环境
function bundleProd() {
  return watchedBrowserify
    .bundle()
    .pipe(source(config.buildName)) // 读取流文件内容
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: config.isDevEnv }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./')) // map映射写入的位置，dist目录
    .pipe(gulp.dest(config.outPath));
}

// 开发环境
gulp.task('copy-html', function () {
  return gulp.src(config.entry.pages).pipe(gulp.dest(config.outPath));
});

const bundleDev = () => {
  return watchedBrowserify
    .bundle()
    .pipe(source(config.buildName)) // 读取流文件内容
    .pipe(buffer())
    .pipe(cleanDir())
    .pipe(gulp.dest(config.outPath));
};

const dyBuildFn = config.isDevEnv ? bundleDev : bundleProd;
let buildSeries = [];

if (config.isDevEnv) {
  buildSeries = [...buildSeries, 'copy-html', dyBuildFn];
} else {
  // 生产
  buildSeries = [...buildSeries, dyBuildFn];
}

// clean dir
gulp.task('clean', function clean() {
  return gulp.src(config.outPath, { allowEmpty: true }).pipe(cleanDir());
});

gulp.task('default', gulp.series(...buildSeries));

watchedBrowserify.on('update', dyBuildFn); // 监听更新需要触发的事件
watchedBrowserify.on('log', console.log); // 输出log
