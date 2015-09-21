'use strict';

const gulp = require('gulp'),
      jshint = require('gulp-jshint');

gulp.task('lint', function() {

  const lint = jshint({
    "esnext": true,
    "curly": false,
    "eqeqeq": true,
    "immed": true,
    "newcap": false,
    "noarg": true,
    "sub": true,
    "unused": "var",
    "boss": true,
    "eqnull": true,
    "node": true,
    "-W086": true
  });

  return gulp.src([
    'index.js',
    'cli/*.js',
    'client/**/*.js',
    'server/index.js',
    'server/lib/*.js',
    'tunnel/index.js',
    'tunnel/lib/*.js'
  ]).pipe(lint).pipe(jshint.reporter('jshint-stylish'));

});

gulp.task('default', ['lint']);
