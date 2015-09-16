'use strict';

const GeneratedModel = require('../generated/models/Group.js'),
      Feed = require('./Feed'),
      db = require('../db');

class Group extends GeneratedModel {

  constructor(...args) {
    super(...args);
  }

  static find(q) {

    return super.find(q)
      .then(groups => {
        return Promise.all(
          groups.map(group => {
            return this.loadFeeds(group);
          })
        );
      });

  }

  static get(id) {
    return super.get(id).then(this.loadFeeds);
  }

  static create(data) {
    return super.create(data).then(this.loadFeeds);
  }

  static replace(id, data) {
    return super.replace(id, data).then(this.loadFeeds);
  }

  static update(id, data) {
    return super.update(id, data).then(this.loadFeeds);
  }

  static loadFeeds(group) {

    return new Promise((resolve, reject) => {

      db.find({type: 'Feed', 'Feed.group_id': group.id}).sort({ 'Feed.created_at': -1 }).exec((err, docs) => {

        if(err)
          return reject(err.message);

        if(! docs)
          return resolve(group);

        group.feeds = docs.map(feed => {
          feed['Feed'].id = feed._id;
          return new Feed(feed['Feed']);
        });

        resolve(group);

      });

    });

  }

}

exports = module.exports = Group;
