'use strict';

const Client = require('../client'),
      CLI = require('./index'),
      Yargs = require('yargs'),
      inquirer = require('inquirer');

class ClientCLI extends CLI {

  constructor() {

    super('client');

    this.completions = [
      'help',
      'config'
    ];

    this.yargs = Yargs(process.argv.slice(3));
    this.client = false;
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

  setupCompletions(ready) {

    if(! process.env.AIO_CLIENT_USER || ! process.env.AIO_CLIENT_KEY)
      return ready();

    const parse = function() {

      const apis = this.client.swagger.apis;

      Object.keys(apis).forEach(api => {

        if(api === 'help') return;

        const lower = api.toLowerCase();
        this.completions.push(lower);
        this.completions[lower] = ['help', 'watch'];

        Object.keys(apis[api].operations).forEach(operation => {
          this.completions[lower].push(operation);
          this.completions[lower][operation] = ['help'];
        });

      });

      ready();

    };

    this.client = new Client(process.env.AIO_CLIENT_USER, process.env.AIO_CLIENT_KEY, {
      success: parse.bind(this),
      failure: this.error.bind(this)
    });

  }

  setupAPI(yargs) {

    yargs
      .usage('Usage: adafruit-io client <command> [options]')
      .command('config', 'Configure the client', this.requireAuth.bind(this));

    const apis = this.client.swagger.apis;

    Object.keys(apis).forEach(api => {

      if(api === 'help') return;

      yargs.command(api.toLowerCase(), `Adafruit IO ${api} API commands`);

    });

    yargs.command('help', 'Show help');

    const argv = yargs
      .demand(1, 'You must supply a valid client command')
      .argv;

    if(! argv)
      return;

    const command = argv._[0][0].toUpperCase() + argv._[0].slice(1);

    if(command === 'Help')
      return yargs.showHelp();

    if(command === 'Config')
      return;

    if(Object.keys(apis).indexOf(command) < 0)
      return yargs.showHelp();

    this.setupOperations(command, Yargs(process.argv.slice(4)));

  }

  setupOperations(api, yargs) {

    const operations = this.client.swagger.apis[api].operations;

    yargs.usage(`Usage: adafruit-io client ${api.toLowerCase()} <action> [options]`);

    Object.keys(operations).forEach(operation => {
      yargs.command(`${operation}`, operations[operation].summary, this.handleOperation.bind(this, api, operation));
    });

    yargs.command('watch', 'Listen for new values', this.handleWatch.bind(this, api));
    yargs.command('write', `Write STDIN to ${api.toLowerCase()}`, this.handleWrite.bind(this, api));

    yargs.command('help', 'Show help');

    const argv = yargs
      .demand(1, 'You must supply a valid command')
      .updateStrings({
        'Commands:': 'Actions:'
      })
      .argv;

    const command = argv._[0];

    if(command === 'help')
      return yargs.showHelp();

    if(command === 'watch' || command === 'write')
      return;

    if(Object.keys(operations).indexOf(command) < 0)
      return yargs.showHelp();

  }

  pathParams(operation) {
    return operation.parameters.filter(param => param.in === 'path' && param.required);
  }

  bodyParam(operation) {
    return operation.parameters.find(param => param.in === 'body' && param.required);
  }

  handleOperation(api, operation, yargs) {

    const operations = this.client.swagger.apis[api].operations,
          params = this.pathParams(operations[operation]);

    params.forEach(param => yargs.command(param.name, param.description));
    yargs.command('help', 'Show help');

    const argv = yargs
      .usage(`Usage: adafruit-io client ${api.toLowerCase()} ${operation}` + this.pathParams(operations[operation]).map(param => ` <${param.name}>`).join('') + ' [options]')
      .alias('j', 'json').describe('j', 'JSON output')
      .updateStrings({
        'Commands:': 'Parameters:'
      })
      .argv;

    if(argv._[1] === 'help')
      return yargs.showHelp();

    if(argv._.length < (params.length + 1))
      return yargs.showHelp();

    const body = this.bodyParam(operations[operation]),
          args = {};

    params.forEach((param, index) => {
      args[param.name] = argv._[index + 1];
    });

    if(! body) {
      return this.client[api][operation](args)
        .then(res => {
          if(argv.json)
            return console.log(JSON.stringify(res.obj));

          this.info('Success');
          console.log(res.obj);
        })
        .catch(res => this.error(res.obj.toString().replace('Error: ', '')));
    }

    const questions = Object.keys(body.schema.properties).map(name => {
      const prop = body.schema.properties[name];
      return {
        type: prop.enum ? 'list' : 'string',
        name: name,
        choices: prop.enum ? prop.enum : [],
        message: `${body.name}.${name} (${prop.required ? 'required' : 'optional'}):`
      };
    });

    inquirer.prompt(questions, answers => {
      args[body.name] = answers;
      this.client[api][operation](args)
        .then(res => {
          if(argv.json)
            return console.log(JSON.stringify(res.obj));

          this.info('Success');
          console.log(res.obj);
        })
        .catch(res => this.error(res.obj.toString().replace('Error: ', '')));
    });

  }

  handleWatch(api, yargs) {

    yargs.command('id', 'ID, key, or name to watch');
    yargs.command('help', 'Show help');

    const argv = yargs
      .usage(`Usage: adafruit-io client ${api.toLowerCase()} watch <id>`)
      .alias('j', 'json').describe('j', 'JSON output')
      .updateStrings({
        'Commands:': 'Parameters:'
      })
      .argv;

    if(argv._[1] === 'help')
      return yargs.showHelp();

    if(argv._.length < 2)
      return yargs.showHelp();

    this.client[api].readable(argv._[1]).on('data', message => {

      if(argv.json)
        return console.log(message.toString());

      const obj = JSON.parse(message);

      this.info(`${api} -> ${obj.name || obj.id}`);
      console.log(obj);

    });

  }

  handleWrite(api, yargs) {

    yargs.command('id', 'ID, key, or name to write to');
    yargs.command('help', 'Show help');

    const argv = yargs
      .usage(`Usage: adafruit-io client ${api.toLowerCase()} write <id>`)
      .updateStrings({
        'Commands:': 'Parameters:'
      })
      .argv;

    if(argv._[1] === 'help')
      return yargs.showHelp();

    if(argv._.length < 2)
      return yargs.showHelp();

    console.log('Waiting for input...');
    console.log('Type a value and press return to send to %s.', argv._[1]);
    console.log('Use CTRL-C to quit');

    process.stdin.pipe(this.client[api].writable(argv._[1]));

  }

  requireAuth(yargs) {

    const argv = yargs
      .usage('Usage: adafruit-io client config [options]')
      .alias('h', 'host').nargs('h', 1).default('h', process.env.AIO_CLIENT_HOST || 'io.adafruit.com').describe('h', 'Server hostname')
      .alias('p', 'port').nargs('p', 1).default('p', process.env.AIO_CLIENT_PORT || '80').describe('p', 'Server port')
      .alias('u', 'username').demand('username').nargs('u', 1).describe('u', 'Adafruit IO Username')
      .alias('k', 'key').demand('key').nargs('k', 1).describe('k', 'Adafruit IO Key')
      .command('help', 'Show help')
      .argv;

    process.env.AIO_CLIENT_HOST = argv.host;
    process.env.AIO_CLIENT_PORT = argv.port;
    process.env.AIO_CLIENT_USER = argv.username;
    process.env.AIO_CLIENT_KEY  = argv.key;

    this.saveEnv();

  }

}

exports = module.exports = ClientCLI;
