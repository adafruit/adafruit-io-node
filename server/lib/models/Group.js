'use strict';
/************************ DEPENDENCIES *****************************/
const util = require('util'),
      Model = require('./Base');

class Group extends Model {

  constructor(properties) {
    super(properties);
  }

  static type() {
    return 'Group';
  }
  static fields() {
    return [
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
  }

}

exports = module.exports = Group;

