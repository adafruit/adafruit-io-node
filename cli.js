#!/usr/bin/env node

process.title = 'adafruit-io';
require('dotenv').config({silent: true});

const CLI = require('./cli/index'),
      cli = new CLI();

cli.init();
