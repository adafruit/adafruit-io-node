'use strict';

const Client = require('../client'),
      CLI = require('./index'),
      Yargs = require('yargs'),
      util = require('util');

class ClientCLI extends CLI {

  constructor() {

    super('client');

    this.yargs = Yargs(process.argv.slice(3));
    this.client = false;

    this.init();

  }

  init() {

    if(! process.env.AIO_CLIENT_USER || ! process.env.AIO_CLIENT_KEY)
      return this.requireAuth(this.yargs);

    const options = {
      success: this.setupAPI.bind(this, this.yargs),
      failure: this.error.bind(this)
    };

    if(process.env.AIO_CLIENT_HOST)
      options.host = process.env.AIO_CLIENT_HOST;

    if(process.env.AIO_CLIENT_PORT)
      options.port = process.env.AIO_CLIENT_PORT;

    this.client = new Client(process.env.AIO_CLIENT_USER, process.env.AIO_CLIENT_KEY, options);

  }

  setupAPI(yargs) {

    yargs
      .usage('Usage: adafruit-io client <command> [options]')
      .command('config', 'configure the client');

    const apis = this.client.swagger.apis;

    Object.keys(apis).forEach(api => {

      if(api === 'help') return;

      yargs.command(api.toLowerCase(), `Adafruit IO ${api} API commands`);

    });

    yargs.command('help', 'Show help');

    const argv = yargs
      .demand(1, 'You must supply a valid client command')
      .argv;

    const command = argv._[0];

    if(command === 'help')
      return yargs.showHelp();

    if(command === 'config')
      return this.requireAuth(Yargs(process.argv.slice(4)));

    this.setupOperations(command[0].toUpperCase() + command.slice(1), Yargs(process.argv.slice(4)));

  }

  setupOperations(api, yargs) {

    const operations = this.client.swagger.apis[api].operations;

    yargs.usage(`Usage: adafruit-io client ${api.toLowerCase()} <action>`);

    Object.keys(operations).forEach(operation => {
      yargs.command(operation, operations[operation].summary);
    });

    yargs.command('help', 'Show help');

    const argv = yargs
      .demand(1, 'you must supply a valid command')
      .updateStrings({
        'Commands:': 'Actions:'
      })
      .argv;

    const command = argv._[0];

    if(command === 'help')
      return yargs.showHelp();

    this.client[api][command]({}).then(res => console.log(util.inspect(res.obj))).catch(console.log);

  }

  requireAuth(yargs) {

    const argv = yargs
      .usage('Usage: adafruit-io client [options]')
      .alias('h', 'host').nargs('h', 1).default('h','io.adafruit.com').describe('h', 'Server hostname')
      .alias('p', 'port').nargs('p', 1).default('p', '8080').describe('p', 'Server port')
      .alias('u', 'username').demand('username').nargs('u', 1).describe('u', 'Adafruit IO Username')
      .alias('k', 'key').demand('key').nargs('k', 1).describe('k', 'Adafruit IO Key')
      .help('help').argv;

    process.env.AIO_CLIENT_HOST = argv.host;
    process.env.AIO_CLIENT_PORT = argv.port;
    process.env.AIO_CLIENT_USER = argv.username;
    process.env.AIO_CLIENT_KEY  = argv.key;

    this.saveEnv();

    this.info('Client settings saved');

  }

}

exports = module.exports = ClientCLI;
