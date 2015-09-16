'use strict';

const GeneratedModel = require('../generated/models/Group.js'),
      Feed = require('./Feed');

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

      Feed.find({group_id: group.id})
        .then(feeds => {
          group.feeds = feeds;
          resolve(group);
        })
        .catch(err => {
          group.feeds = [];
          resolve(group);
        });

    });

  }

}

exports = module.exports = Group;
