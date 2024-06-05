var gulp         = require('gulp');
var clean        = require('gulp-clean');
var jshint       = require('gulp-jshint');
var stylish      = require('jshint-stylish');
var livereload   = require('gulp-livereload');
var lr           = require('tiny-lr');
var server       = lr();
var stylus       = require('gulp-stylus');
var concat       = require('gulp-concat');
var handlebars   = require('gulp-handlebars');
var connect      = require("connect");
var pushState    = require('connect-pushstate/lib/pushstate').pushState;
var http         = require("http");
var runSequence  = require('run-sequence');
var rjs          = require('gulp-requirejs');
var replace      = require("gulp-replace");
var rename       = require('gulp-rename');
var uglify       = require('gulp-uglify');
var environments = require('./environments');

var index,
    out,
    env,
    cache,
    lrs = '';

gulp.task('clean:out', function(){
  return gulp.src(  out, {read: false} )
        .pipe(clean());
});

gulp.task('clean:cache', function(cb){
  return gulp.src(  cache, {read: false} )
        .pipe(clean());
});

gulp.task('lint', function() {
  return gulp.src('./app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('assets', function() {
  return gulp.src(['./app/assets/**/*', '!./app/assets/*.html'])
        .pipe(gulp.dest( out ));
});

gulp.task('api', function() {
  return gulp.src(['./api/**/*'])
        .pipe(gulp.dest( out + 'api' ) );
});

gulp.task('vendor:js', function(){
  return gulp.src([
          './vendor/js/*.js',
          './vendor/js/bower_components/requirejs/require.js',
          './vendor/js/bower_components/jquery/dist/jquery.js',
          './vendor/js/bower_components/jquery.scrollTo/jquery.scrollTo.js',
          './vendor/js/bower_components/lodash/dist/lodash.js',
          './vendor/js/bower_components/backbone/backbone.js',
          './vendor/js/bower_components/backbone.localstorage/backbone.localStorage.js',
          './vendor/js/bower_components/marionette/lib/backbone.marionette.js',
          './vendor/js/bower_components/handlebars/handlebars.runtime.js',
          './vendor/js/bower_components/fastclick-amd/fastclick.js'
        ])
        .pipe(gulp.dest( ( cache || out ) + 'app/vendor' ));
});

gulp.task('scripts:bundle', function(cb) {
  gulp.src(['./vendor/js/bower_components/almond/almond.js', './vendor/js/modernizr.custom.31718.js', './vendor/js/md5.js'])
      .pipe( gulp.dest( out + 'app/vendor' ) );

  rjs({
    name: 'main-bundle',
    baseUrl: cache + 'app/',
    out: 'main.js',
    paths:{
      jquery: "vendor/jquery",
      scrollto: "vendor/jquery.scrollTo",
      fastclick: "vendor/fastclick",
      underscore: 'vendor/lodash',
      backbone: 'vendor/backbone',
      localstorage: 'vendor/backbone.localStorage',
      marionette: 'vendor/backbone.marionette',
      prettynames: 'vendor/backbone.prettynames',
      handlebars: 'vendor/handlebars.runtime',
    },
    shim: {
      scrollto: {
        deps: ['jquery'],
        exports: 'scrollto'
      },
      underscore: {
        exports: '_'
      },
      handlebars: {
        exports: 'Handlebars'
      },
      backbone: {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      prettynames: {
        deps: ['backbone']
      },
      localstorage: {
        deps: ['backbone']
      },
      marionette: {
        deps: ['jquery', 'underscore', 'backbone', 'localstorage', 'prettynames'],
        exports: 'Backbone.Marionette'
      }
    }
  })
  .pipe(uglify())
  .pipe(gulp.dest( out + 'app/' ));;

  cb.call();
});

gulp.task('vendor:css', function(){
  return gulp.src('./vendor/css/**/*')
        .pipe(replace('[root]', env.appRoot))
        .pipe(gulp.dest( out + 'css/vendor'));
});

gulp.task('scripts', function() {
  return gulp.src('./app/**/*.js')
        .pipe(gulp.dest( (cache || out ) + 'app/' ));
});

gulp.task('env', ['lint', 'scripts'], function() {
  return gulp.src( ( cache || out ) + '/app/environment.js' )
        .pipe(replace('[ENV]', JSON.stringify( env )))
        .pipe(gulp.dest( ( cache || out ) + 'app/' ));
});

gulp.task('index', ['assets'], function() {
  return gulp.src( index )
        .pipe(replace('[root]', env.appRoot))
        .pipe(replace('[livereload]', lrs))
        .pipe(rename('index.html'))
        .pipe(gulp.dest( out ));
});

gulp.task('stylus', function() {
  return gulp.src([
          './app/views/styles/styles.styl',
          './app/apps/**/styles.styl'
        ])
        .pipe(stylus({
          use: ['nib'],
          set:['compress', 'lineos']
        }))
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest(  out + 'css/' )).pipe(livereload(server));
});

gulp.task('handlebars', function(){
  return gulp.src(['./app/**/*.hbs'])
        .pipe(handlebars({
          outputType: 'amd',
          wrapped: 'true'
         }))
        .pipe(gulp.dest( ( cache || out ) + 'app/'));
});

gulp.task('connect', function() {
  var app = connect()
  // .use(connect.logger('dev'))
  .use(pushState())
  .use(connect.static( out ))
  .listen(9000, function() {
    console.log('Application server stated on port', 9000);
  });
});

gulp.task('livereload', function() {
  server.listen(35729, function(err) {
    if (err) return console.log(err);
  });
});

gulp.task('watch', function() {
  gulp.watch('./app/assets/**/*', ['assets', 'index']);
  gulp.watch('./app/vendor/**/*', ['vendor:js', 'vendor:css']);
  gulp.watch(['./environment.js', './app/**/*.js', '!./app/vendor/**/*.*'], ['lint', 'scripts', 'env']);
  gulp.watch('./app/**/*.hbs', ['handlebars']);
  gulp.watch('./app/**/*.styl', ['stylus']);

  gulp.watch([  out + '**/*' ]).on('change', function(file){
    livereload(server).changed(file.path);
  });
});

gulp.task('default', ['local']);

gulp.task('local', function(){
  index = './app/assets/dev.html';
  out = './.tmp/';
  env = environments( 'local' );
  lrs = '<script src="http://localhost:35729/livereload.js"></script>';
  runSequence(
    'clean:out',
    'lint',
    ['assets', 'api', 'vendor:js', 'vendor:css', 'scripts', 'stylus', 'handlebars'],
    ['env', 'index'],
    ['livereload', 'connect'],
    'watch'
  );
});

gulp.task('grace:dev', function(){
  index = './app/assets/build.html';
  out = './dev/';
  cache = './dev/.cache/';
  env = environments( 'grace_dev' );
  lrs = '';
  runSequence(
    'clean:out',
    ['vendor:js', 'scripts', 'handlebars', 'env'],
    'scripts:bundle',
    'clean:cache',
    ['assets', 'api','vendor:css', 'stylus', 'index']
  );
});

gulp.task('grace:production', function(){
  index = './app/assets/build.html';
  out = './pub/';
  cache = './pub/.cache/';
  env = environments( 'grace_production' );
  lrs = '';
  runSequence(
    'clean:out',
    ['vendor:js', 'scripts', 'handlebars', 'env'],
    'scripts:bundle',
    'clean:cache',
    ['assets', 'api', 'vendor:css', 'stylus', 'index']
  );
});

gulp.task('wpengine:dev', function(){
  index = './app/assets/dev.html';
  out = './dev/';
  cache = './dev/.cache/';
  env = environments( 'wpengine_dev' );
  lrs = '';
  runSequence(
    'clean:out',
    ['vendor:js', 'scripts', 'handlebars', 'env'],
    'scripts:bundle',
    'clean:cache',
    ['assets', 'api','vendor:css', 'stylus', 'index']
  );
});

gulp.task('wpengine:production', function(){
  index = './app/assets/build.html';
  out = './pub/';
  cache = './pub/.cache/';
  env = environments( 'wpengine_production' );
  lrs = '';
  runSequence(
    'clean:out',
    ['vendor:js', 'scripts', 'handlebars', 'env'],
    'scripts:bundle',
    'clean:cache',
    ['assets', 'api', 'vendor:css', 'stylus', 'index']
  );
});