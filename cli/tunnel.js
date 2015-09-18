'use strict';

const CLI = require('./index');

class TunnelCLI extends CLI {

  constructor(yargs) {

    super({
      type: 'tunnel',
      yargs: yargs,
      required: 1
    });

  }

  setup() {}

}

exports = module.exports = TunnelCLI;

