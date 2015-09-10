'use strict';

const db = require('../db');

class Base {

  constructor(properties) {

    properties = properties || {};

    this.constructor.validate(properties);
    this.properties = properties;

    this.constructor.fields().forEach(key => {
      Object.defineProperty(this, key, {
        get: () => this.properties[key],
        set: value => { this.properties[key] = value }
      });
    });

  }

  toJSON() {
    return this.toObject();
  }

  toObject() {
    return this.properties;
  }

  toString() {
    return JSON.stringify(this.toObject());
  }

  static type() {
    return 'Base';
  }

  static fields() {
    return [];
  }

  static validate(properties) {

    Object.keys(properties).forEach(key => {

      if(this.fields().indexOf(key) < 0)
        throw `invalid property ${key} for ${this.type()}`;

    });

  }

  static all() {

    const type = this.type();

    return new Promise((resolve, reject) => {

      db.find({type: type}, (err, docs) => {

        if(err)
          return reject(err.message);

        resolve(docs.map(doc => {
          doc[type].id = doc._id;
          return new this(doc[type]);
        }));

      });

    });

  }

  static get(...args) {

    const type = this.type(),
          id = args.pop();

    return new Promise((resolve, reject) => {

      db.findOne(id_query(type, id), (err, doc) => {

        if(err)
          return reject(err.message);

        if(! doc)
          return reject('not found');

        doc[type].id = doc._id;
        resolve(new this(doc[type]));

      });

    });

  }

  static create(sent) {

    const type = this.type();

    return new Promise((resolve, reject) => {

      const obj = {type: type};

      delete sent.id;
      sent.updated_at = (new Date()).toISOString();
      sent.created_at = sent.updated_at;
      obj[type] = sent;

      db.insert(obj, (err, doc) => {

        if(err)
          return reject(err.message);

        doc[type].id = doc._id;
        resolve(new this(doc[type]));

      });

    });

  }

  static replace(...args) {

    const type = this.type(),
          sent = args.pop(),
          id = args.pop();

    return new Promise((resolve, reject) => {

      const obj = {type: type};

      delete sent.id;
      sent.updated_at = (new Date()).toISOString();
      obj[type] = sent;

      db.update(id_query(type, id), obj, {}, (err, replaced, doc) => {

        if(err)
          return reject(err.message);

        if(replaced !== 1)
          return reject('update failed');

        console.log(doc);

        doc[type].id = doc._id;
        resolve(new this(doc[type]));

      });

    });

  }

  static update(...args) {

    const type = this.type(),
          sent = args.pop(),
          id = args.pop();

    return new Promise((resolve, reject) => {

      delete sent.id;
      sent.updated_at = (new Date()).toISOString();


      db.update(id_query(type, id), set_fields(type, sent), {}, (err, replaced, doc) => {

        if(err)
          return reject(err.message);

        if(replaced !== 1)
          return reject('update failed');


        resolve(this.get(sent.id || sent.key || sent.name || id));

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

  return obj;

};

exports = module.exports = Base;
