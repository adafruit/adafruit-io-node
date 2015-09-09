'use strict';
/************************ DEPENDENCIES *****************************/
const util = require('util'),
      Model = require('./Base');

class Data extends Model {

  constructor(properties) {
    super(properties);
  }

  static type() {
    return 'Data';
  }
  static fields() {
    return [
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
  }

}

exports = module.exports = Data;

