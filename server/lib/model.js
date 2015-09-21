'use strict';

const db = require('./db');

class Model {

  constructor(properties) {

    properties = properties || {};

    this.constructor.validate(properties);
    this.properties = Object.assign({}, properties);

    Object.keys(this.constructor.fields()).forEach(key => {

      Object.defineProperty(this, key, {
        get: () => {
          return this.properties[key];
        },
        set: (value) => {
          this.properties[key] = value;
        }
      });

    });

  }

  toJSON() {
    return this.toObject();
  }

  toObject() {

    const keys = Object.keys(this.constructor.fields()),
          obj = {};

    keys.forEach(key => {
      obj[key] = this[key] || null;
    });

    return obj;

  }

  toString() {
    return JSON.stringify(this.toObject());
  }

  static type() {
    return 'Base';
  }

  static field(key) {
    return this.fields()[key];
  }

  static fields() {
    return {};
  }

  static validate(properties) {

    Object.keys(properties).forEach(key => {

      if(Object.keys(this.fields()).indexOf(key) < 0)
        throw `invalid property ${key} for ${this.type()}`;

    });

  }

  static all() {
    return this.find();
  }

  static find(q) {

    const type = this.type(),
          query = {type: type};

    if(q) {
      Object.keys(q).forEach(function(key) {
        query[`${type}.${key}`] = q[key];
      });
    }

    return new Promise((resolve, reject) => {

      db.find(query, (err, docs) => {

        if(err)
          return reject(err.message);

        if(! docs)
          return resolve([]);

        resolve(docs.map(doc => {
          doc[type].id = doc._id;
          return new this(doc[type]);
        }));

      });

    });

  }

  static get(id) {

    const type = this.type();

    return new Promise((resolve, reject) => {

      db.findOne(this.idQuery(id), (err, doc) => {

        if(err)
          return reject(err.message);

        if(! doc)
          return reject(`${type} not found`);

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
      sent.updated_at = new Date();
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

  static replace(id, sent) {

    const type = this.type();

    return new Promise((resolve, reject) => {

      const obj = {type: type};

      delete sent.id;
      sent.updated_at = new Date();
      obj[type] = sent;

      db.update(this.idQuery(id), obj, {}, (err, replaced, doc) => {

        if(err)
          return reject(err.message);

        if(replaced !== 1)
          return reject('update failed');

        doc[type].id = doc._id;
        resolve(new this(doc[type]));

      });

    });

  }

  static update(id, sent) {

    return new Promise((resolve, reject) => {

      delete sent.id;
      sent.updated_at = new Date();

      db.update(this.idQuery(id), this.setFields(sent), {}, (err, replaced, doc) => {

        if(err)
          return reject(err.message);

        if(replaced !== 1)
          return reject('update failed');

        this.get(sent.id || sent.key || sent.name || id)
          .then(d => {
            resolve(d);
          })
          .catch(err => {
            reject(err);
          });

      });

    });

  }

  static destroy(id) {

    return new Promise((resolve, reject) => {

      db.remove(this.idQuery(id), {}, (err, removed) => {

        if(err)
          return reject(err.message);

        if(removed !== 1)
          return reject('delete failed');

        resolve();

      });

    });

  }

  static idQuery(id_key_name) {

    const type = this.type();

    const query = {
      type: type,
      '$or': [
        {_id: id_key_name}
      ]
    };

    query['$or'].push({[`${type}.key`]: id_key_name});
    query['$or'].push({[`${type}.name`]: id_key_name});

    return query;

  }

  static setFields(sent) {

    const type = this.type(),
          obj = { '$set': {} };

    Object.keys(sent).forEach(key => {
      obj['$set'][`${type}.${key}`] = sent[key];
    });

    return obj;

  }

}

exports = module.exports = Model;
