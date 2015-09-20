#!/usr/bin/env node

process.title = 'adafruit-io';
const path = require('path');
require('dotenv').config({silent: true, path: path.join(__dirname, '.env')});

const CLI = require('./cli/index'),
      cli = new CLI();

cli.init();
