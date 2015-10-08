'use strict';

const CLI = require('./index'),
      Yargs = require('yargs');

class TunnelCLI extends CLI {

  constructor() {

    super('tunnel');

    this.completions = [
      'help',
      'start',
      'restart',
      'stop'
    ];

    if(require('os').platform() === 'linux')
      this.completions.push('install', 'remove');

    this.yargs = Yargs(process.argv.slice(3));

  }

  init() {

    this.yargs.usage('Usage: adafruit-io tunnel <command> [options]');

    if(require('os').platform() === 'linux') {
      this.yargs.command('install', 'Install server service (linux only)');
      this.yargs.command('remove', 'Remove server service (linux only)');
    }

    const argv = this.yargs
      .command('install', 'Install tunnel service (linux only)')
      .command('remove', 'Remove tunnel service (linux only)')
      .command('start', 'Start tunnel daemon')
      .command('restart', 'Restart tunnel daemon')
      .command('stop', 'Stop tunnel daemon')
      .command('help', 'Show help')
      .alias('h', 'http').nargs('h', 1).default('h', process.env.AIO_TUNNEL_HTTP || '8888').describe('h', 'HTTP port')
      .alias('m', 'mqtt').nargs('m', 1).default('m', process.env.AIO_TUNNEL_MQTT || '1883').describe('m', 'MQTT port')
      .demand(1, 'You must supply a valid tunnel command')
      .argv;

    if(! argv)
      return;

    const command = argv._[0];

    if(command === 'help')
      return this.yargs.showHelp();

    if(parseInt(process.env.AIO_TUNNEL_HTTP) !== parseInt(argv.http) || parseInt(process.env.AIO_TUNNEL_MQTT) !== parseInt(argv.mqtt)) {
      process.env.AIO_TUNNEL_MQTT = argv.mqtt;
      process.env.AIO_TUNNEL_HTTP = argv.http;
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

    this.portAvailable(process.env.AIO_TUNNEL_HTTP)
      .catch(err => {
        this.error(`HTTP Port ${process.env.AIO_TUNNEL_HTTP} is not available.\nPlease set another with the --http option`);
        process.exit(1);
      })
      .then(() => this.portAvailable(process.env.AIO_TUNNEL_MQTT))
      .then(() => {
        this.foreverService('install');
        this.info(`io.adafruit.com HTTPS tunnel running: http://${this.hostname()}:${process.env.AIO_TUNNEL_HTTP}/`);
        this.info(`io.adafruit.com MQTTS tunnel running: mqtt://${this.hostname()}:${process.env.AIO_TUNNEL_MQTT}`);
      })
      .catch(err => {
        this.error(`MQTT Port ${process.env.AIO_TUNNEL_MQTT} is not available.\nPlease set another with the --mqtt option`);
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
    this.info('starting tunnel...');

    this.portAvailable(process.env.AIO_TUNNEL_HTTP)
      .catch(err => {
        this.error(`HTTP Port ${process.env.AIO_TUNNEL_HTTP} is not available.\nPlease set another with the --http option`);
        process.exit(1);
      })
      .then(() => this.portAvailable(process.env.AIO_TUNNEL_MQTT))
      .then(() => {
        this.forever('start');
        this.info(`io.adafruit.com HTTPS tunnel running: http://${this.hostname()}:${process.env.AIO_TUNNEL_HTTP}/`);
        this.info(`io.adafruit.com MQTTS tunnel running: mqtt://${this.hostname()}:${process.env.AIO_TUNNEL_MQTT}`);
      })
      .catch(err => {
        this.error(`MQTT Port ${process.env.AIO_TUNNEL_MQTT} is not available.\nPlease set another with the --mqtt option`);
        process.exit(1);
      });

  }

  restart() {
    this.forever('restart');
    this.info('restarting tunnel...');
  }

  stop() {
    this.forever('stop');
    this.info('stopping tunnel...');
  }

}

exports = module.exports = TunnelCLI;

