'use strict';

const Client = require('../client'),
      CLI = require('./index');

class ClientCLI extends CLI {

  constructor(yargs) {

    this.client = false;

    super({
      type: 'client',
      yargs: yargs,
      required: 2
    });

  }

  setup() {

    if(! process.env.AIO_CLIENT_USER || ! process.env.AIO_CLIENT_KEY)
      return this.requireAuth(this.yargs);

    const options = {
      success: this.setupAPI.bind(this),
      failure: this.error.bind(this)
    };

    if(process.env.AIO_CLIENT_HOST)
      options.host = process.env.AIO_CLIENT_HOST;

    if(process.env.AIO_CLIENT_PORT)
      options.port = process.env.AIO_CLIENT_PORT;

    this.client = new Client(process.env.AIO_CLIENT_USER, process.env.AIO_CLIENT_KEY, options);

  }

  setupAPI() {

    this.yargs.usage('Usage: adafruit-io client <api> [options]');
    this.required = 1;

    this.yargs.command('config', 'configure the client', this.requireAuth.bind(this));

    const apis = this.client.swagger.apis;

    Object.keys(apis).forEach(api => {

      if(api === 'help') return;

      const lower = api.toLowerCase();

      this.yargs.command(lower, `${lower} API`, this.setupOperations.bind(this, api));

    });

    this.argv = this.yargs.help('help').wrap(null).argv;

  }

  setupOperations(api, yargs) {

    const operations = this.client.swagger.apis[api].operations;

    yargs.usage(`Usage: $0 client ${api} [options]`);

    Object.keys(operations).forEach(operation => {
      yargs.command(operation, operations[operation].summary, y => {
        this.info(`${api} ${operation}`);
      });
    });

    const argv = yargs
      .help('help')
      .updateStrings({
        'Commands:': 'Actions:'
      })
      .wrap(null)
      .argv;

  }

  requireAuth(yargs) {

    this.argv = yargs
      .usage('Usage: adafruit-io client [options]')
      .alias('h', 'host').nargs('h', 1).default('h','io.adafruit.com').describe('h', 'Server hostname')
      .alias('p', 'port').nargs('p', 1).default('p', '8080').describe('p', 'Server port')
      .alias('u', 'username').demand('username').nargs('u', 1).describe('u', 'Adafruit IO Username')
      .alias('k', 'key').demand('key').nargs('k', 1).describe('k', 'Adafruit IO Key')
      .help('help').wrap(null).argv;

    process.env.AIO_CLIENT_HOST = this.argv.host;
    process.env.AIO_CLIENT_PORT = this.argv.port;
    process.env.AIO_CLIENT_USER = this.argv.username;
    process.env.AIO_CLIENT_KEY  = this.argv.key;

    this.saveEnv();

    this.info('Client settings saved');

  }

}

exports = module.exports = ClientCLI;
