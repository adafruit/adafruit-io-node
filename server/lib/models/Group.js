'use strict';
/************************ DEPENDENCIES *****************************/
var util = require('util'),
    model = require('./index');

util.inherits(Group, model);
var proto = Group.prototype;
exports = module.exports = Group;

/************************* CONSTRUCTOR ****************************/
function Group(properties) {

  if (! (this instanceof Group))
    return new Group(properties);

  model.call(this);
  util._extend(this, properties || {});

}

/*************************** DEFAULTS *****************************/
proto._fields = [
  'id',
  'name',
  'description',
  'source',
  'properties',
  'source_keys',
  'created_at',
  'updated_at',
  'feeds'
];
