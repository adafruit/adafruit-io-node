var rest = require('restler'),
    util = require('util');

function constructor(key, id, options) {

  this.defaults.headers['X-AIO-Key'] = key;
  this.id = id;

  util._extend(this.defaults, options || {});

  return this;

}

var defaults = {
  id: false,
  baseURL: 'https://io.adafruit.com/api/',
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Node.js adafruit-io client'
  }
};

var methods = {
  load: function(cb) {

    var self = this,
        get;

    // check if user provided id or cb as first arg
    if(this.id) {
      get = this.get('groups/' + this.id + '.json');
    } else {
      get = this.get('groups');
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

    var get = this.get('groups/' + type + '.json');

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

    var post = this.post('groups', { data: data });

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

    var post = this.post('groups/' + this.id + '/send.json', { data: data });

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

    if(!this.id) {
      return cb('No group ID supplied to update');
    }

    var patch = this.patch('groups/' + this.id + '.json', { data: data });

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
      return cb('No group ID supplied to delete');
    }

    var del = this.del('groups/' + this.id + '.json');

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
