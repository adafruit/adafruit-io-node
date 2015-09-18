'use strict';

const CLI = require('./index');

class ServerCLI extends CLI {

  constructor(yargs) {

    super({
      type: 'server',
      yargs: yargs,
      required: 1
    });

  }

  setup() {}

}

exports = module.exports = ServerCLI;
