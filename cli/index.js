'use strict';

const yargs = require('yargs'),
      winston = require('winston'),
      chalk = require('chalk'),
      version = require('../package.json').version,
      spawn = require('child_process').spawn,
      fs = require('fs'),
      path = require('path');

class CLI {

  constructor(options) {

    this.type = 'cli';
    this.yargs = yargs;
    this.argv = false;
    this.required = 1;

    Object.assign(this, options || {});

    this.logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          formatter: options => {
            const level = chalk.bold(`[${options.level}]`);
            return `${level}: ${options.message || '' }`;
          }
        })
      ]
    });

    this.logger.extend(this);

    this.setup();

  }

  validate(argv) {

    if(argv._.length < this.required)
      this.yargs.showHelp();

  }

  setup() {

    this.argv = this.yargs
      .usage('Usage: adafruit-io <command>')
      .command('server', 'Adafruit IO local server', yargs => { const server = require('./server'); new server(yargs); })
      .command('client', 'Adafruit IO client', yargs => { const client = require('./client'); new client(yargs); })
      .command('tunnel', 'TLS tunnel to io.adafruit.com', yargs => { const tunnel = require('./tunnel'); new tunnel(yargs); })
      .help('help').version(version).wrap(null).argv;

    this.validate(this.argv);

  }

  logo() {

    const logo = fs.readFileSync(path.join(__dirname, '..', 'logo.txt'), 'utf8');
    process.stdout.write(logo);

  }

  hostname() {
    return require('os').hostname();
  }

  spawn(command, args) {

    const child = spawn(command, args, {
      cwd: path.join(__dirname, '..', this.type),
      env: process.env,
      detached: true
    });

    child.on('error', this.error);
    child.on('exit', function(code) {
      process.exit(code);
    });

  }

  forever(command) {

    const forever = process.platform === 'win32' ? 'forever.cmd' : 'forever';

    this.spawn(forever, [command, '-c', 'node --es_staging', 'index.js']);

  }

  foreverService(command) {

    if(require('os').platform() !== 'linux')
      return this.error('running adafruit io as a service is only supported on linux');

    if(command === 'install')
      this.spawn('forever-service', ['install', '-s', 'index.js', '--foreverOptions', '" -c node --es_staging"', '--start', `aio${this.type}`]);
    else if(command === 'remove')
      this.spawn('forever-service', ['delete', `aio${this.type}`]);

  }

  saveEnv() {

    let out = '';

    Object.keys(process.env).forEach(key => {

      if(/^AIO/.test(key))
        out += `${key}=${process.env[key]}\n`;

    });

    if(out)
      fs.writeFileSync(path.join(__dirname, '..', '.env'), out);

  }

}

exports = module.exports = CLI;
