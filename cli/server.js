'use strict';

const CLI = require('./index'),
      Yargs = require('yargs');

class ServerCLI extends CLI {

  constructor() {

    super('server');

    this.completions = [
      'help',
      'config',
      'start',
      'restart',
      'stop'
    ];

    if(require('os').platform() === 'linux')
      this.completions.push('install', 'remove');

    this.yargs = Yargs(process.argv.slice(3));

  }

  init() {

    if(! process.env.AIO_SERVER_USER || ! process.env.AIO_SERVER_KEY)
      return this.requireAuth(this.yargs);

    this.yargs
      .usage('Usage: adafruit-io server <command> [options]')
      .command('config', 'Configure the local server');

    if(require('os').platform() === 'linux') {
      this.yargs.command('install', 'Install server service (linux only)');
      this.yargs.command('remove', 'Remove server service (linux only)');
    }

    const argv = this.yargs
      .command('start', 'Start server daemon')
      .command('restart', 'Restart server daemon')
      .command('stop', 'Stop server daemon')
      .command('help', 'Show help')
      .alias('p', 'port')
      .nargs('p', 1).default('p', process.env.AIO_SERVER_PORT || '8080')
      .describe('p', 'Server port')
      .demand(1, 'You must supply a valid server command')
      .argv;

    if(! argv)
      return;

    const command = argv._[0];

    if(command === 'help')
      return this.yargs.showHelp();

    if(command === 'config')
      return this.requireAuth(Yargs(process.argv.slice(4)));

    if(parseInt(process.env.AIO_SERVER_PORT) !== parseInt(argv.port)) {
      process.env.AIO_SERVER_PORT = argv.port;
      this.saveEnv();
    }

    if(! this[command])
      return this.yargs.showHelp();

    this[command]();

  }

  install() {

    if(require('os').platform() !== 'linux')
      return this.error('running adafruit io as a service is only supported on linux');

    this.logo();
    this.info('installing service...');

    this.portAvailable(process.env.AIO_SERVER_PORT)
      .then(() => {
        this.foreverService('install');
        this.info(`server ready at http://${this.hostname()}:${process.env.AIO_SERVER_PORT}/`);
        this.info(`documentation is available at http://${this.hostname()}:${process.env.AIO_SERVER_PORT}/api/docs`);
      })
      .catch(err => {
        this.error(`Port ${process.env.AIO_SERVER_PORT} is not available.\nPlease set another with the --port option`);
        process.exit(1);
      });

  }

  remove() {

    if(require('os').platform() !== 'linux')
      return this.error('running adafruit io as a service is only supported on linux');

    this.foreverService('remove');
    this.info('removing service...');

  }

  start() {
    this.logo();
    this.info('starting server...');

    this.portAvailable(process.env.AIO_SERVER_PORT)
      .then(() => {
        this.forever('start');
        this.info(`server ready at http://${this.hostname()}:${process.env.AIO_SERVER_PORT}/`);
        this.info(`documentation is available at http://${this.hostname()}:${process.env.AIO_SERVER_PORT}/api/docs`);
      })
      .catch(err => {
        this.error(`Port ${process.env.AIO_SERVER_PORT} is not available.\nPlease set another with the --port option`);
        process.exit(1);
      });

  }

  restart() {
    this.forever('restart');
    this.info('restarting server...');
  }

  stop() {
    this.forever('stop');
    this.info('stopping server...');
  }

  requireAuth(yargs) {

    const argv = yargs
      .usage('Usage: adafruit-io server config [options]')
      .alias('p', 'port').nargs('p', 1).default('p', '8080').describe('p', 'Server port')
      .alias('u', 'username').demand('username').nargs('u', 1).describe('u', 'Local Adafruit IO Username')
      .alias('k', 'key').demand('key').nargs('k', 1).describe('k', 'Local Adafruit IO Key')
      .command('help', 'Show help')
      .argv;

    process.env.AIO_SERVER_PORT = argv.port;
    process.env.AIO_SERVER_USER = argv.username;
    process.env.AIO_SERVER_KEY  = argv.key;

    this.constructor.getDbPath()
      .then(db => {
        process.env.AIO_SERVER_DB = db;
        this.saveEnv();
      }).catch(this.error);

  }

}

exports = module.exports = ServerCLI;
