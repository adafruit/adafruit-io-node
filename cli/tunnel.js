'use strict';

const CLI = require('./index'),
      Yargs = require('yargs');

class TunnelCLI extends CLI {

  constructor() {

    super('tunnel');

    this.yargs = Yargs(process.argv.slice(3));

    this.init();

  }

  init() {

    const argv = this.yargs
      .usage('Usage: adafruit-io tunnel <command> [options]')
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

    const command = argv._[0];

    if(command === 'help')
      return yargs.showHelp();

    process.env.AIO_TUNNEL_MQTT = argv.mqtt;
    process.env.AIO_TUNNEL_HTTP = argv.http;
    this.saveEnv();

    this[command]();

  }

  install() {

    if(require('os').platform() !== 'linux')
      return this.error('running adafruit io as a service is only supported on linux');

    this.logo();
    this.foreverService('install');
    this.info(`io.adafruit.com HTTPS tunnel running: http://${this.hostname()}:${process.env.AIO_TUNNEL_HTTP}/`);
    this.info(`io.adafruit.com MQTTS tunnel running: mqtt://${this.hostname()}:${process.env.AIO_TUNNEL_MQTT}`);

  }

  remove() {

    if(require('os').platform() !== 'linux')
      return this.error('running adafruit io as a service is only supported on linux');

    this.foreverService('remove');
    this.info('removing service...');

  }

  start() {
    this.logo();
    this.forever('start');
    this.info(`io.adafruit.com HTTPS tunnel running: http://${this.hostname()}:${process.env.AIO_TUNNEL_HTTP}/`);
    this.info(`io.adafruit.com MQTTS tunnel running: mqtt://${this.hostname()}:${process.env.AIO_TUNNEL_MQTT}`);
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

