var rest = require('restler'),
    util = require('util');

function constructor(key, options) {

  this.defaults.headers['X-AIO-Key'] = key;

  util._extend(this.defaults, options || {});

}

var defaults = {
  baseURL: 'https://io.adafruit.com',
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'aio-client-node'
  }
};

var methods = {
  get: function(id) {

    if(id) {
      return this.get('/api/feeds/' + id + '.json');
    }

    return this.get('/api/feeds.json');

  },
  create: function(data) {

    if(data instanceof String) {
      data = { name: data };
    }

    return this.post('/api/feeds.json', { data: data });
  },
  update: function(id, data) {

    if(data instanceof String) {
      data = { name: data };
    }

    return this.patch('/api/feeds/' + id + '.json', { data: data });

  },
  delete: function(id) {
    return this.del('/api/feeds/' + id + '.json');
  }

};

exports = module.exports = rest.service(constructor, defaults, methods);
