'use strict';
/************************ DEPENDENCIES *****************************/
var util = require('util'),
    model = require('./index');

util.inherits(Data, model);
var proto = Data.prototype;
exports = module.exports = Data;

/************************* CONSTRUCTOR ****************************/
function Data(properties) {

  if (! (this instanceof Data))
    return new Data(properties);

  model.call(this);
  util._extend(this, properties || {});

}

/*************************** DEFAULTS *****************************/
proto._fields = [
  'id',
  'value',
  'position',
  'feed_id',
  'group_id',
  'expiration',
  'lat',
  'lon',
  'ele',
  'completed_at',
  'created_at',
  'updated_at',
  'created_epoch'
];
