var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha');

process.env.TUNNEL_HTTP_PORT = 3000;
process.env.TUNNEL_MQTT_PORT = 3001;

gulp.task('lint', function() {

  var lint = jshint({
    "curly": false,
    "eqeqeq": true,
    "immed": true,
    "latedef": "nofunc",
    "newcap": false,
    "noarg": true,
    "sub": true,
    "undef": false,
    "unused": "var",
    "boss": true,
    "eqnull": true,
    "node": true,
    "-W086": true
  });

  return gulp.src([
    'index.js',
    'cli',
    'test/*.js'
  ]).pipe(lint)
  .pipe(jshint.reporter('jshint-stylish'));

});

gulp.task('test', function() {

  return gulp.src('test/*.js', {read: false})
    .pipe(mocha())
    .once('error', function(err) {
      console.error(err.toString());
      process.exit(1);
    })
    .once('end', function() {
      process.exit();
    });

});

gulp.task('default', ['lint', 'test']);
