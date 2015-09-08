'use strict';
/************************ DEPENDENCIES *****************************/
var util = require('util'),
    model = require('./index');

util.inherits(Feed, model);
var proto = Feed.prototype;
exports = module.exports = Feed;

/************************* CONSTRUCTOR ****************************/
function Feed(properties) {

  if (! (this instanceof Feed))
    return new Feed(properties);

  model.call(this);
  util._extend(this, properties || {});

}

/*************************** DEFAULTS *****************************/
proto._fields = [
  'id',
  'name',
  'key',
  'description',
  'unit_type',
  'unit_symbol',
  'visibility',
  'license',
  'enabled',
  'last_value',
  'status',
  'group_id',
  'created_at',
  'updated_at'
];
