var Feeds = require('./client/feeds'),
    Groups = require('./client/groups'),
    Streams = require('./client/streams');

var proto = Client.prototype;

function Client(key) {

  if (!(this instanceof Client)) {
    return new Client(key);
  }

  if(!key) {
    throw 'You must provide an Adafruit IO API key';
  }

  this.key = key;

}

proto.key = false;

proto.feeds = function(id, cb) {

  var feeds;

  if(typeof id != 'function') {
    feeds = new Feeds(this.key, id);
  } else {
    feeds = new Feeds(this.key);
    cb = id;
  }

  return feeds.load(cb);

};

proto.create_feed = function(data, cb) {

  var feeds = new Feeds(this.key);

  return feeds.create(data, cb);

};

exports = module.exports = Client;
