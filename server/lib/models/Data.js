'use strict';

const GeneratedModel = require('../generated/models/Data.js'),
      Feed = require('./Feed');

class Data extends GeneratedModel {

  constructor(...args) {
    super(...args);
  }

  static all(feed_id) {

    return Feed.get(feed_id)
      .then(feed => {
        return this.find({feed_id: feed.id});
      });

  }

  static create(feed_id, data) {

    return Feed.get(feed_id)
      .then(feed => {
        data.feed_id = feed.id;
        return super.create(data);
      });

  }

  static send(feed_id, data) {

    return Feed.get(feed_id)
      .catch(err => {
        return Feed.create({name: feed_id});
      })
      .then(feed => {
        return this.create(feed.id, data);
      });

  }

  static next(...args) {
    return super.get(...args);
  }

  static last(...args) {
    return super.get(...args);
  }

  static previous(...args) {
    return super.get(...args);

  }

  static receive(...args) {
    return super.get(...args);
  }

}

exports = module.exports = Data;
