'use strict';
/************************ DEPENDENCIES *****************************/
const util = require('util'),
      Model = require('./Base');

class Feed extends Model {

  constructor(properties) {
    super(properties);
  }

  static type() {
    return 'Feed';
  }
  static fields() {
    return [
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
  }

}

exports = module.exports = Feed;

