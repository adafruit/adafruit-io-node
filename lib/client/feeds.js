var rest = require('restler'),
    util = require('util'),
    Streams = require('./streams'),
    readable = require('./streams/readable');

function constructor(key, id, options) {

  this.defaults.headers['X-AIO-Key'] = key;
  this.key = key;
  this.id = id;

  util._extend(this.defaults, options || {});

  this.readable = readable(key, id);

  return this;

}

var defaults = {
  key: false,
  id: false,
  baseURL: 'https://io.adafruit.com/api/',
  readable: false,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Node.js adafruit-co client'
  }
};

var methods = {
  streams: function(id, cb) {

    var streams;

    if(typeof id != 'function') {
      streams = new Streams(this.key, this.id, id);
    } else {
      streams = new Streams(this.key, this.id);
      cb = id;
    }

    if(typeof cb == 'function') {
      return streams.load(cb);
    }

    return streams;

  },
  create_stream: function(data, cb) {

    var streams = new Streams(this.key, this.id);

    return streams.create(data, cb);

  },
  next: function(cb) {

    var streams = new Streams(this.key, this.id);

    return streams.next(cb);

  },
  last: function(cb) {

    var streams = new Streams(this.key, this.id);

    return streams.last(cb);

  },
  previous: function(cb) {

    var streams = new Streams(this.key, this.id);

    return streams.previous(cb);

  },
  load: function(cb) {

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

  },
  create: function(data, cb) {

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

  },
  update: function(data, cb) {

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

  },
  delete: function(cb) {

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

  }

};

exports = module.exports = rest.service(constructor, defaults, methods);
