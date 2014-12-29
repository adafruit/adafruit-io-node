/**
 * Adafruit IO Writable Stream
 *
 * Copyright (c) 2014 Adafruit Industries
 * Licensed under the MIT license.
 */

/**** Module dependencies ****/
var stream = require('stream'),
    util = require('util'),
    mqtt = require('mqtt');

/**** Make Writable a writable stream ****/
util.inherits(Writable, stream.Writable);

/**** Writable prototype ****/
var proto = Writable.prototype;

/**** Expose Writable ****/
exports = module.exports = Writable;

/**** Writable Constructor ****/
function Writable(key, feed, options) {

  if (! (this instanceof Writable)) {
    return new Readable(key, feed, options);
  }

  stream.Writable.call(this);

  this._feed = feed;
  this._key = key;

  this._connect();

}

proto._connected = false;
proto._key = false;
proto._feed = false;
proto._host = 'io.adafruit.com';
proto._port = 1883;

proto._connect = function() {

  this._client = mqtt.connect('mqtt://' + this._key + '@' + this._host + ':' + this._port);

  this._connected = true;
  this.emit('connected');

};

proto._write = function(data, encoding, cb) {

  if(! this._connected) {
    return this.once('connected', function() {
      this._write(data, encoding, cb);
    });
  }

  if(!this._client) {
    return cb('Not connected');
  }

  this._client.publish('api/feeds/' + this._feed + '/streams/send.json', data);
  cb();

};

