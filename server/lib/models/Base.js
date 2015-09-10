'use strict';
const db = require('../db'),
      uuid = require('uuid');

class Base {
  constructor(properties) {
    Object.assign(this, properties);
  }

  static type() {
    return 'Base';
  }

  static fields() {
    return [];
  }

  static all() {

    const type = this.type();

    return new Promise(function(resolve, reject) {

      let data = [];

      db.query({type: type})
        .on('data', function(d) {
          data.push(d[type]);
        })
        .on('end', function() {
          resolve(data);
        });

    });

  }

  static get(...args) {

    const type = this.type(),
          id_key_name = args.pop();

    return new Promise(function(resolve, reject) {

      let data = null,
          query = {type: type},
          id = {}, key = {}, name = {};

      id[`${type}.id`] = id_key_name;
      key[`${type}.key`] = id_key_name;
      name[`${type}.name`] = id_key_name;
      query['$or'] = [id, key, name];

      db.query(query)
        .once('data', function(d) {
          data = d[type];
        })
        .on('end', function() {
          resolve(data);
        });

    });

  }

  static create(sent) {

    const type = this.type();

    return new Promise(function(resolve, reject) {

      const obj = {type: type};

      sent.id = uuid.v1();
      sent.updated_at = (new Date()).toISOString();
      sent.created_at = sent.updated_at;
      obj[type] = sent;

      db.put(`${type}|${sent.id}`, obj, function(err) {

        if(err) return reject(err);

        resolve(sent);

      });

    });

  }

  static replace(...args) {

    const type = this.type(),
          sent = args.pop(),
          id = args.pop();

    return new Promise(function(resolve, reject) {

      const obj = {type: type};

      sent.updated_at = (new Date()).toISOString();
      obj[type] = sent;

      db.put(`${type}|${sent.id}`, obj, function(err) {

        if(err) return reject(err);

        resolve(sent);

      });

    });

  }

}

exports = module.exports = Base;
