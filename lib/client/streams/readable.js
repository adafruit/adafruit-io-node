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
function Readable(feed, options) {

  if (! (this instanceof Readable)) {
    return new Readable(feed, options);
  }

  options = util._extend({
    highWaterMark: 64 * 1024 // 64k
  }, options || {});

  stream.Readable.call(this);

  this.feed = feed;

  this.subscribe();

}

proto.subscribed = false;
proto.feed = false;
proto.host = 'io.adafruit.com';
proto.port = 1883;
proto.buffer = [];

proto.subscribe = function() {

  var client = mqtt.connect('mqtt://' + this.host + ':' + this.port);

  client.subscribe('/api/feeds/' + this.feed);
  client.on('message', function(topic, message) {
    this.buffer.push(message);
    this.emit('message', message);
  }.bind(this));

  this.subscribed = true;
  this.emit('subscribed');

};

proto._read = function() {

  if(! this.subscribed) {
    return this.once('subscribed', function() {
      this._read();
    });
  }

  if(this.buffer.length === 0) {
    return this.once('message', function() {
      this._read();
    });
  }

  this.push(this.bufffer.shift());

};
