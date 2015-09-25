'use strict';

const gulp = require('gulp'),
      eslint = require('gulp-eslint');

gulp.task('lint', function() {

  const config = {
    ecmaFeatures: {
      templateStrings: true
    },
    env: ['node', 'es6']
  };

  return gulp.src([
    'index.js',
    'cli/*.js',
    'client/**/*.js',
    'server/index.js',
    'server/lib/*.js',
    'tunnel/index.js',
    'tunnel/lib/*.js'
  ]).pipe(eslint(config)).pipe(eslint.format()).pipe(eslint.failAfterError());

});

gulp.task('default', ['lint']);
