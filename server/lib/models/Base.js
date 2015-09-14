'use strict';

const db = require('../db');

class Base {

  constructor(properties) {

    properties = properties || {};

    this.constructor.validate(properties);
    this.properties = properties;

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

  loadChildren() {

    const id = `${this.constructor.type().toLowerCase()}_id`,
          promises = [];

    Object.keys(this.constructor.fields()).forEach(key => {

      const cls = this.constructor.field(key).children;

      if(! cls)
        return;

      promises.push(
        require(`./${cls}`).find({[id]: this.id})
          .then(feeds => {
            this.feeds = feeds.map(feed => { return feed.toObject(); });
          })
      );

    });

    return promises;

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

        const promises = [];

        docs = docs.map(doc => {
          doc[type].id = doc._id;
          doc = new this(doc[type]);
          promises.push(...doc.loadChildren());
          return doc;
        });

        Promise.all(promises)
          .then(() => {
            resolve(docs);
          })
          .catch(err => {
            reject(err);
          });

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
        doc = new this(doc[type]);

        Promise.all(doc.loadChildren())
          .then(() => {
            resolve(doc);
          })
          .catch(err => {
            reject(err);
          });

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
        doc = new this(doc[type]);

        Promise.all(doc.loadChildren())
          .then(() => {
            resolve(doc);
          })
          .catch(err => {
            reject(err);
          });


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

        doc[type].id = doc._id;
        doc = new this(doc[type]);

        Promise.all(doc.loadChildren())
          .then(() => {
            resolve(doc);
          })
          .catch(err => {
            reject(err);
          });


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

        this.get(sent.id || sent.key || sent.name || id)
          .then(d => {
            doc = d;
            return doc.loadChildren();
          })
          .then(() => {
            resolve(doc);
          })
          .catch(err => {
            reject(err);
          });

      });

    });

  }

  static destroy(id) {

    const type = this.type();

    return new Promise((resolve, reject) => {

      db.remove(id_query(type, id), {}, (err, removed) => {

        if(err)
          return reject(err.message);

        if(removed !== 1)
          return reject('delete failed');

        resolve();

      });

    });

  }

}

const id_query = function(type, id_key_name) {

  return {
    type: type,
    '$or': [
      {[`${type}.id`]: id_key_name},
      {[`${type}.key`]: id_key_name},
      {[`${type}.name`]: id_key_name}
    ]
  };

};

const set_fields = function(type, sent) {

  const obj = { '$set': {} };

  Object.keys(sent).forEach(key => {
    obj['$set'][`${type}.${key}`] = sent[key];
  });

  return obj;

};

exports = module.exports = Base;
