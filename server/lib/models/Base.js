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

}

exports = module.exports = Base;
