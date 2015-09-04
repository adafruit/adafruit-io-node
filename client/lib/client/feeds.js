var rest = require('restler'),
    util = require('util'),
    mqtt = require('mqtt'),
    stream = require('stream'),
    Data = require('./data');

util.inherits(Feeds, stream.Duplex);

/**** Feeds prototype ****/
var proto = Feeds.prototype;
util._extend(proto, rest.Service.prototype);

/**** Expose Feeds ****/
exports = module.exports = Feeds;

/**** Feeds Constructor ****/
function Feeds(username, key, id, options) {

  this.headers['X-AIO-Key'] = key;
  this.username = username;
  this.key = key;
  this.id = id;

  util._extend(this, options || {});

  stream.Duplex.call(this);

  this.defaults = {
    headers: this.headers,
    baseURL: this.baseURL
  };

  this._writableState.objectMode = true;

  this.connect();

  return this;

}

proto.username = false;
proto.key = false;
proto.id = false;
proto.baseURL = 'https://io.adafruit.com/api/';
proto.headers = {
  'Accept': 'application/json',
  'User-Agent': 'Node.js adafruit-io client'
};
proto.client = false;
proto.host = 'io.adafruit.com';
proto.port = 1883;
proto.buffer = [];
proto.connected = false;

proto.connect = function() {

  this.client = mqtt.connect({
    host: this.host,
    port: this.port,
    username: this.username,
    password: this.key,
    keepalive: 3600
  });

  this.client.on('connect', function() {
    this.client.subscribe(this.username + '/f/' + this.id);
    this.connected = true;
    this.emit('connected');
  }.bind(this));

  this.client.on('offline', function() {
    this.connected = false;
  }.bind(this));

  this.client.on('close', function() {
    this.connected = false;
  }.bind(this));

  this.client.on('message', function(topic, message) {
    this.buffer.push(message);
    this.emit('message', message);
  }.bind(this));

};

proto._read = function() {

  if(! this.connected) {
    return this.once('connected', function() {
      this._read();
    });
  }

  if(this.buffer.length === 0) {
    return this.once('message', function() {
      this._read();
    });
  }

  this.push(this.buffer.shift());

};

proto._write = function(data, encoding, cb) {

  if(! this.connected) {
    return this.once('connected', function() {
      this._write(data, encoding, cb);
    });
  }

  if(! data || ! data.toString) {
    return cb('invalid data sent to feed');
  }

  this.client.publish(this.username + '/f/' + this.id, data.toString());
  cb();

};

proto.data = function(id, cb) {

  var data;

  if(typeof id != 'function') {
    data = new Data(this.key, this.id, id);
  } else {
    data = new Data(this.key, this.id);
    cb = id;
  }

  if(typeof cb == 'function') {
    return data.load(cb);
  }

  return data;

};

proto.create_data = function(data, cb) {

  var data = new Data(this.key, this.id);

  return data.create(data, cb);

};

proto.next = function(cb) {

  var data = new Data(this.key, this.id);

  return data.next(cb);

};

proto.last = function(cb) {

  var data = new Data(this.key, this.id);

  return data.last(cb);

};

proto.previous = function(cb) {

  var data = new Data(this.key, this.id);

  return data.previous(cb);

};

proto.load = function(cb) {

  var self = this,
      get;

  // check if user provided id or cb as first arg
  if(this.id) {
    get = this.get('feeds/' + this.id + '.json');
  } else {
    get = this.get('feeds.json');
  }

  // if user provides a callback, call it with the result or err
  if(typeof cb == 'function') {
    get.on('complete', function(result, res) {

      if(result instanceof Error) {
        return cb(result);
      }

      cb(null, result);

    });
  }

  return this;

};

proto.create = function(data, cb) {

  if(typeof data == 'string') {
    data = { name: data };
  }

  var post = this.post('feeds.json', { data: data });

  // if user provides a callback, call it with any errors and a bool for creation
  if(typeof cb == 'function') {

    post.on('complete', function(result, res) {

      if(res.statusCode === 201) {
        return cb(null, true);
      }

      cb(null, false);

    });

  }

  return this;

};

proto.update = function(data, cb) {

  if(typeof data == 'string') {
    data = { name: data };
  }

  if(!this.id) {
    return cb('No feed ID supplied to update');
  }

  var patch = this.patch('feeds/' + this.id + '.json', { data: data });

  // if user provides a callback, call it with any errors and the response
  if(typeof cb == 'function') {

    patch.on('complete', function(result, res) {

      if(res.statusCode === 200) {
        return cb(null, result);
      }

      if(result instanceof Error) {
        return cb(result);
      }

      cb(null, false);

    });

  }

  return this;

};

proto.delete = function(cb) {

  if(!this.id) {
    return cb('No feed ID supplied to update');
  }

  var del = this.del('feeds/' + this.id + '.json');

  // if user provides a callback, call it with any errors and a bool for delete
  if(typeof cb == 'function') {

    del.on('complete', function(result, res) {

      if(res.statusCode === 200) {
        return cb(null, true);
      }

      if(result instanceof Error) {
        return cb(result);
      }

      cb(null, false);

    });

  }

  return this;

};
