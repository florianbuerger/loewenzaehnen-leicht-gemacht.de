var gulp = require('gulp');
var cp = require('child_process');
var browserSync = require('browser-sync');
var clean = require('gulp-clean');

gulp.task('css', function() {
    var postcss    = require('gulp-postcss');
    var sourcemaps = require('gulp-sourcemaps');

    return gulp.src('css/*.css')
        .pipe( sourcemaps.init() )
        .pipe( postcss([ require('autoprefixer'), require('precss') ]) )
        .pipe( sourcemaps.write('.') )
        .pipe( gulp.dest('_site/') );
});

gulp.task('clean', function() {
  return gulp.src(['css', 'js'], {read: false})
    .pipe(clean());
});

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify('Building Jekyll');
    return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--incremental'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build', 'css'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        },
        host: "localhost"
    });
});

gulp.task('watch', function() {
  // Watch .html files and posts
  gulp.watch(['index.html', '_includes/*.html', '_layouts/*.html', '*.md', '*.markdown', '_posts/*'], ['jekyll-rebuild']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('browser-sync', 'watch');
});
