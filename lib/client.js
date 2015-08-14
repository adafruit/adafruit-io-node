var Feeds = require('./client/feeds'),
    Data = require('./client/data'),
    Groups = require('./client/groups');

var proto = Client.prototype;

function Client(username, key) {

  if (!(this instanceof Client)) {
    return new Client(username, key);
  }

  if(!username) {
    throw 'You must provide an Adafruit IO username';
  }

  if(!key) {
    throw 'You must provide an Adafruit IO API key';
  }

  this.username = username;
  this.key = key;

}

proto.username = false;
proto.key = false;

proto.feeds = function(id, cb) {

  var feeds;

  if(typeof id != 'function') {
    feeds = new Feeds(this.username, this.key, id);
  } else {
    feeds = new Feeds(this.username, this.key);
    cb = id;
  }

  if(typeof cb == 'function') {
    return feeds.load(cb);
  }

  return feeds;

};

proto.create_feed = function(data, cb) {

  var feeds = new Feeds(this.username, this.key);

  return feeds.create(data, cb);

};

proto.groups = function(id, cb) {

  var groups;

  if(typeof id != 'function') {
    groups = new Groups(this.key, id);
  } else {
    groups = new Groups(this.key);
    cb = id;
  }

  if(typeof cb == 'function') {
    return groups.load(cb);
  }

  return groups;

};

proto.create_group = function(data, cb) {

  var groups = new Groups(this.key);

  return groups.create(data, cb);

};

proto.send = function(feed_name, data, cb) {

  var feed_data = new Data(this.key, feed_name);

  return feed_data.send(data, cb);

};

exports = module.exports = Client;
