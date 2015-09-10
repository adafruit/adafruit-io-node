'use strict';
const db = require('../db');

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

    return new Promise(function all_promise(resolve, reject) {

      db.find({type: type}, function all_db(err, docs) {

        if(err)
          return reject('database error');

        resolve(docs.map(function all_map(doc) {
          doc[type].id = doc._id;
          resolve(doc[type]);
        }));

      });

    });

  }

  static get(...args) {

    const type = this.type(),
          id = args.pop();

    return new Promise(function get_promise(resolve, reject) {

      db.findOne(id_query(type, id), function get_db(err, doc) {

        if(err)
          return reject('database error');

        doc[type].id = doc._id;
        resolve(doc[type]);

      });

    });

  }

  static create(sent) {

    const type = this.type();

    return new Promise(function create_promise(resolve, reject) {

      const obj = {type: type};

      delete sent.id;
      sent.updated_at = (new Date()).toISOString();
      sent.created_at = sent.updated_at;
      obj[type] = sent;

      db.insert(obj, function create_db(err, doc) {

        if(err)
          return reject('creation failed');

        doc[type].id = doc._id;
        resolve(doc[type]);

      });

    });

  }

  static replace(...args) {

    const type = this.type(),
          sent = args.pop(),
          id = args.pop();

    return new Promise(function replace_promise(resolve, reject) {

      const obj = {type: type};

      delete sent.id;
      sent.updated_at = (new Date()).toISOString();
      obj[type] = sent;

      db.update(id_query(type, id), obj, function replace_db(err, doc) {

        if(err)
          return reject('update failed');

        doc[type].id = doc._id;
        resolve(doc[type]);

      });

    });

  }

  static update(...args) {

    const type = this.type(),
          sent = args.pop(),
          id = args.pop();

    return new Promise(function update_promise(resolve, reject) {

      const obj = {type: type};

      delete sent.id;
      sent.updated_at = (new Date()).toISOString();
      obj[type] = set_fields(type, sent);

      db.update(id_query(type, id), obj, function update_db(err, doc) {

        if(err)
          return reject('update failed');

        doc[type].id = doc._id;
        resolve(doc[type]);

      });

    });

  }


}

const id_query = function id_query(type, id_key_name) {

  const query = {type: type},
        id = {}, key = {}, name = {};

  id[`${type}.id`] = id_key_name;
  key[`${type}.key`] = id_key_name;
  name[`${type}.name`] = id_key_name;
  query['$or'] = [id, key, name];

  return query;

};

const set_fields = function set_fields(type, sent) {

  const obj = { '$set': {} };

  Object.keys(sent).forEach(function set_field_for(key) {
    obj['$set'][`${type}.${key}`] = sent[key];
  });

};

exports = module.exports = Base;
