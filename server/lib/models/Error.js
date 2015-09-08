'use strict';
/************************ DEPENDENCIES *****************************/
var util = require('util'),
    model = require('./index');

util.inherits(Error, model);
var proto = Error.prototype;
exports = module.exports = Error;

/************************* CONSTRUCTOR ****************************/
function Error(properties) {

  if (! (this instanceof Error))
    return new Error(properties);

  model.call(this);
  util._extend(this, properties || {});

}

/*************************** DEFAULTS *****************************/
proto._fields = [
  'error'
];
