'use strict';

const yargs = require('yargs'),
      winston = require('winston'),
      chalk = require('chalk'),
      version = require('../package.json').version,
      spawn = require('child_process').spawn,
      fs = require('fs'),
      path = require('path'),
      mkdir = require('mkdirp');

class CLI {

  constructor(type) {

    this.type = type || 'cli';
    this.completions = [
      'client',
      'server',
      'tunnel',
      'help',
      'version'
    ];

    this.sub = {
      client: require('./client'),
      server: require('./server'),
      tunnel: require('./tunnel')
    };

    this.logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          level: 'debug',
          formatter: options => {
            const level = chalk.bold(`[${options.level}]`);
            return `${level} ${options.message || '' }`;
          }
        })
      ]
    });

    this.yargs = yargs;
    this.logger.extend(this);

  }

  init() {

    this.yargs
      .usage('Usage: adafruit-io <command>')
      .command('server', 'Adafruit IO local server')
      .command('client', 'Adafruit IO client')
      .command('tunnel', 'TLS tunnel to io.adafruit.com')
      .command('help', 'Show help')
      .command('version', 'Show version info');

    if(process.platform !== 'win32')
      this.yargs.completion('completion', this.getCompletions.bind(this, this.sub));

    const argv = this.yargs.demand(1, 'Please provide a valid command').argv;

    if(! argv)
      return;

    const command = argv._[0];

    if(command === 'help')
      return this.yargs.showHelp();

    if(command === 'version') {
      console.log(version);
      process.exit();
    }

    if(command === 'completion') {
      this.yargs.showCompletionScript();
      process.exit();
    }

    if(Object.keys(this.sub).indexOf(command) < 0)
      return this.yargs.showHelp();

    const child = new this.sub[command]();

    child.init();

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
      if(/^AIO/.test(key)) out += `${key}=${process.env[key]}\n`;
    });

    if(out) {
      this.constructor.getConfigPath()
        .then(f => {
          fs.writeFileSync(f, out);
          this.info('Configuration saved');
        })
        .catch(this.error);
    }

  }

  getCompletions(children, current, argv, done) {

    const commands = argv._;

    if(commands[0] === 'adafruit-io')
      commands.splice(0, 1);

    if(! commands.length)
      return done(this.completions);

    if(commands.length === 1 && this.completions.indexOf(current) < 0)
      return done(this.completions.filter(item => (new RegExp(`^${current}`)).test(item)));

    if(Object.keys(children).indexOf(commands[0]) < 0)
      return done([]);

    if(commands[0] === 'server' || commands[0] === 'tunnel') {

      const child = new children[commands[0]]();

      if(commands.length === 1)
        return done(child.completions);

      if(commands.length === 2)
        return done(child.completions.filter(item => (new RegExp(`^${current}`)).test(item)));

      return done([]);

    }

    const client = new children.client();

    // deal with swagger API loading
    client.setupCompletions(() => {

      let completions = client.completions;

      commands.forEach(command => {
        if(completions.hasOwnProperty(command)) {
          completions = completions[command];
        }
        current = (command === current ? '' : current);
      });

      if(! current)
        return done(completions);

      done(client.completions.filter(item => (new RegExp(`^${current}`)).test(item)));

    });

  }

  portAvailable(port) {

    const net = require('net');

    return new Promise((resolve, reject) => {

     const socket = new net.Socket();

      socket
        .once('error', err => resolve())
        .once('timeout', () => { socket.destroy(); resolve(); })
        .once('connect', () => { socket.destroy(); reject(); })
        .once('close', err => { reject(); })
        .connect(port, '127.0.0.1');

    });

  }

  static getUserHome() {
    return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
  }

  static getAdafruitIoFolder() {

    const folder = path.join(this.getUserHome(), '.adafruit_io');

    return new Promise((resolve, reject) => {

      mkdir(path.join(this.getUserHome(), '.adafruit_io'), err => {

        if(err)
          return reject(err);

        resolve(folder);

      });

    });

  }

  static getConfigPath() {
    return this.getAdafruitIoFolder().then(folder => path.join(folder, 'config'));
  }

  static getDbPath() {
    return this.getAdafruitIoFolder().then(folder => path.join(folder, 'adafruit_io.db'));
  }

}

exports = module.exports = CLI;
