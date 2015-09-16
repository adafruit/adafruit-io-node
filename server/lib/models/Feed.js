'use strict';

const GeneratedModel = require('../generated/models/Feed.js'),
      db = require('../db');

class Feed extends GeneratedModel {

  constructor(...args) {
    super(...args);
  }

  static find(q) {

    return super.find(q)
      .then(feeds => {
        return Promise.all(
          feeds.map(feed => {
            return this.lastData(feed);
          })
        );
      });

  }

  static get(id) {
    return super.get(id).then(this.lastData);
  }

  static create(data) {
    return super.create(data).then(this.lastData);
  }

  static replace(id, data) {
    return super.replace(id, data).then(this.lastData);
  }

  static update(id, data) {
    return super.update(id, data).then(this.lastData);
  }

  static lastData(feed) {

    return new Promise((resolve, reject) => {

      db.findOne({type: 'Data', 'Data.feed_id': feed.id}).sort({ 'Data.created_at': -1 }).exec((err, doc) => {

        if(err)
          return reject(err.message);

        if(! doc)
          return resolve(feed);

        feed.last_value = doc.Data.value;

        resolve(feed);

      });

    });

  }

}

exports = module.exports = Feed;
