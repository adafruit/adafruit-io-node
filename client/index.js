'use strict';

const Swagger = require('./lib/client'),
      Stream = require('./lib/stream'),
      Signature = require('./lib/signature'),
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
    this.swagger_path = '/api/docs/v2.json';
    this.authorizations = {
      HeaderKey: new HeaderKey(this.key)
    };

    Object.assign(this, options || {});

    if(! this.username)
      throw new Error('client username is required');

    if(! this.key)
      throw new Error('client key is required');

    return new Swagger({
      url: `http://${this.host}:${this.port}${this.swagger_path}`,
      usePromise: true,
      authorizations: this.authorizations
    }).then((client) => {
      this.swagger = client;
      this._defineGetters();
      return this;
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

      // add dynamic getter to this class for the API
      Object.defineProperty(this, api, {
        get: () => {
          return this.swagger[api];
        }
      });

    });

  }

  static get Signature() {
    return Signature;
  }

  static get Stream() {
    return Stream;
  }

}

exports = module.exports = Client;
