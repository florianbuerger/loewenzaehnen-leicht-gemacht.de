var gulp = require('gulp');
var cp = require('child_process');
var browserSync = require('browser-sync');

gulp.task('css', function() {
    var postcss = require('gulp-postcss');
    var sourcemaps = require('gulp-sourcemaps');
    var cssnano = require('cssnano');
    var atImport = require('postcss-import');
    var cssnext = require('postcss-cssnext');
    var processors = [
      atImport(),
      cssnext({
              autoprefixer: {
                browsers: ['IE >= 9']
              }
            }),
      cssnano()
    ]

    return gulp.src('css/*.css')
        .pipe( sourcemaps.init() )
        .pipe( postcss(processors) )
        .pipe( sourcemaps.write('.') )
        .pipe( gulp.dest('_site/css') )
        .pipe( browserSync.stream() );
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

gulp.task('css-reload', ['css'], function() {
  browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['jekyll-build', 'css'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        },
        host: "localhost"
    });
});

gulp.task('watch', function() {
  // Watch for .css changes adn reload after post-CSS has run
  gulp.watch(['css/*'], ['css']);
  // Watch .html files and posts
  gulp.watch(['*.html', '_includes/*.html', '_layouts/*.html', '*.md', '*.markdown', '_posts/*'], ['jekyll-rebuild']);
});

gulp.task('default', function() {
    gulp.start('browser-sync', 'watch');
});
