/**
 * Adafruit IO Readable Stream
 *
 * Copyright (c) 2014 Adafruit Industries
 * Licensed under the MIT license.
 */

/**** Module dependencies ****/
var stream = require('stream'),
    util = require('util'),
    mqtt = require('mqtt');

/**** Make Readable a readable stream ****/
util.inherits(Readable, stream.Readable);

/**** Readable prototype ****/
var proto = Readable.prototype;

/**** Expose Readable ****/
exports = module.exports = Readable;

/**** Readable Constructor ****/
function Readable(key, feed, options) {

  if (! (this instanceof Readable)) {
    return new Readable(key, feed, options);
  }

  options = util._extend({
    highWaterMark: 64 * 1024 // 64k
  }, options || {});

  stream.Readable.call(this);

  this._feed = feed;
  this._key = key;

  this._subscribe();

}

proto._subscribed = false;
proto._key = false;
proto._feed = false;
proto._host = 'io.adafruit.com';
proto._port = 1883;
proto._buffer = [];

proto._subscribe = function() {

  var client = mqtt.connect('mqtt://' + this._key + '@' + this._host + ':' + this._port);

  client.subscribe('api/feeds/' + this._feed + '/streams/receive.json');
  client.on('message', function(topic, message) {
    this._buffer.push(message);
    this.emit('message', message);
  }.bind(this));

  this._subscribed = true;
  this.emit('subscribed');

};

proto._read = function() {

  if(! this._subscribed) {
    return this.once('subscribed', function() {
      this._read();
    });
  }

  if(this._buffer.length === 0) {
    return this.once('message', function() {
      this._read();
    });
  }

  this.push(this._buffer.shift());

};
