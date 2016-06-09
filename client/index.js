'use strict';

const Swagger = require('swagger-client-promises'),
      Stream = require('./lib/stream'),
      pkg = require('../package.json');

class HeaderKey  {

  constructor(key) {
    this.key = key;
  }

  apply(obj, authorizations) {
    obj.headers['X-AIO-Key'] = this.key;
    obj.headers['User-Agent'] = `AdafruitIO-Node/${pkg.version} (${process.platform} ${process.arch} ${process.version})`;
    return true;
  }

}

class Client {

  constructor(username, key, options) {

    this.host = 'io.adafruit.com';
    this.port = 80;
    this.username = username || false;
    this.key = key || false;
    this.swagger_path = '/api/docs/v1.json';
    this.success = function() {};
    this.failure = function(err) { throw err; };

    Object.assign(this, options);

    if(! this.username)
      throw new Error('client username is required');

    if(! this.key)
      throw new Error('client key is required');

    this.swagger = new Swagger({
      url: `http://${this.host}:${this.port}${this.swagger_path}`,
      debug: true,
      success: this._defineGetters.bind(this),
      failure: this.failure,
      authorizations: {
        HeaderKey: new HeaderKey(this.key)
      }
    });

  }

  _defineGetters() {

    Object.keys(this.swagger.apis).forEach(api => {

      if(api === 'help')
        return;

      const stream = new Stream({
        type: api.toLowerCase(),
        username: this.username,
        key: this.key,
        host: this.host,
        port: (this.host === 'io.adafruit.com' ? 8883 : 1883)
      });

      this.swagger[api].readable = (id) => { stream.connect(id); return stream; };
      this.swagger[api].writable = (id) => { stream.connect(id); return stream; };

      Object.defineProperty(this, api, {
        get: () => {
          return this.swagger[api];
        }
      });

    });

    this.success();

  }

}

exports = module.exports = Client;
