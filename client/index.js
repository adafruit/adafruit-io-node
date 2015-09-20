'use strict';

const Swagger = require('swagger-client-promises');

class Client {

  constructor(username, key, options) {

    this.host = 'io.adafruit.com';
    this.username = username || false;
    this.key = key || false;
    this.swagger_path = '/api/docs/api.json';
    this.success = function() {};
    this.failure = function(err) { throw err; };

    Object.assign(this, options);

    if(! this.username)
      throw new Error('client username is required');

    if(! this.key)
      throw new Error('client key is required');

    this.swagger = new Swagger({
      url: `http://${this.host}${this.swagger_path}`,
      success: this._defineGetters.bind(this),
      failure: this.failure,
      authorizations: {
        HeaderKey: new Swagger.ApiKeyAuthorization('X-AIO-Key', this.key, 'header')
      }
    });

  }

  _defineGetters() {

    Object.keys(this.swagger.apis).forEach(api => {

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
