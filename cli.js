#!/usr/bin/env node

process.title = 'adafruit-io';

const CLI = require('./cli/index');

CLI.getConfigPath().then(path => {

  require('dotenv').config({silent: true, path: path});

  const cli = new CLI();
  cli.init();

}).catch(console.error);
