var rest = require('restler'),
    util = require('util');

function constructor(key, feed_id, id, options) {

  this.defaults.headers['X-AIO-Key'] = key;
  this.feed_id = feed_id;
  this.id = id;

  this.baseURL += feed_id + '/';

  util._extend(this.defaults, options || {});

  return this;

}

var defaults = {
  feed_id: false,
  id: false,
  baseURL: 'https://io.adafruit.com/api/feeds/',
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'aio-client-node'
  }
};

var methods = {
  load: function(cb) {

    var self = this,
        get;

    // check if user provided id or cb as first arg
    if(this.id) {
      get = this.get('data/' + this.id + '.json');
    } else {
      get = this.get('data.json');
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
  navigation: function(type, cb) {

    var get = this.get('data/' + type + '.json');

    // if user provides a callback, call it with the err and result
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
  last: function(cb) {
    this.navigation.call(this, 'last', cb);
  },
  next: function(cb) {
    this.navigation.call(this, 'next', cb);
  },
  previous: function(cb) {
    this.navigation.call(this, 'previous', cb);
  },
  create: function(data, cb) {

    data = { value: data };

    var post = this.post('data.json', { data: data });

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
  send: function(data, cb) {

    data = { value: data };

    var post = this.post('data/send.json', { data: data });

    // if user provides a callback, call it with any errors and the created stream
    if(typeof cb == 'function') {

      post.on('complete', function(result, res) {

        if(res.statusCode === 200) {
          return cb(null, result);
        }

        cb(null, false);

      });

    }

    return this;

  },
  update: function(data, cb) {

    data = { value: data };

    if(!this.id) {
      return cb('No data ID supplied to update');
    }

    var patch = this.patch('data/' + this.id + '.json', { data: data });

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
      return cb('No data ID supplied to update');
    }

    var del = this.del('data/' + this.id + '.json');

    // if user provides a callback, call it with any errors and a bool for delete status
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
