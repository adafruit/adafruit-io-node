'use strict';
/************************ DEPENDENCIES *****************************/
const util = require('util'),
      Model = require('./Base');

class Error extends Model {

  constructor(properties) {
    super(properties);
  }

  static type() {
    return 'Error';
  }
  static fields() {
    return [
      'error'
    ];
  }

}

exports = module.exports = Error;

