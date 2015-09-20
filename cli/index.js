'use strict';

const yargs = require('yargs'),
      winston = require('winston'),
      chalk = require('chalk'),
      version = require('../package.json').version,
      spawn = require('child_process').spawn,
      fs = require('fs'),
      path = require('path');

class CLI {

  constructor(type) {

    this.type = type || 'cli';

    this.logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          level: 'debug',
          formatter: options => {
            const level = chalk.bold(`[${options.level}]`);
            return `${level}: ${options.message || '' }`;
          }
        })
      ]
    });

    this.logger.extend(this);

  }

  init() {

    const argv = yargs
      .usage('Usage: adafruit-io <command>')
      .command('server', 'Adafruit IO local server')
      .command('client', 'Adafruit IO client')
      .command('tunnel', 'TLS tunnel to io.adafruit.com')
      .command('help', 'Show help')
      .command('version', 'Show version info')
      .command('completion', 'Output Bash command completion script')
      .demand(1, 'Please provide a valid command')
      .argv;

    const command = argv._[0];

    if(command === 'help')
      return yargs.showHelp();

    if(command === 'version') {
      console.log(version);
      process.exit();
    }

    if(command === 'completion') {
      yargs.showCompletionScript();
      process.exit();
    }

    const sub = {
      client: require('./client'),
      server: require('./server'),
      tunnel: require('./tunnel')
    };

    if(Object.keys(sub).indexOf(command) < 0)
      return yargs.showHelp();

    new sub[command]();

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

    child.stderr.on('data', this.error);
    child.on('exit', function(code) {
      process.exit(code);
    });

  }

  forever(command) {

    const forever = process.platform === 'win32' ? 'forever.cmd' : 'forever';

    this.spawn(forever, [command, '-c', 'node --es_staging', 'index.js']);

  }

  foreverService(command) {

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
