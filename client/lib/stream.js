'use strict';

const DuplexStream = require('stream').Duplex,
      mqtt = require('mqtt');

class Stream extends DuplexStream {

  constructor(options) {

    super({
      readableObjectMode: false,
      writableObjectMode: false,
      highWaterMark: 102400
    });

    this.type = 'feeds';
    this.host = 'io.adafruit.com';
    this.port = 8883;
    this.username = false;
    this.key = false;
    this.id = false;
    this.buffer = [];
    this.client = false;

    Object.assign(this, options || {});

    if(this.type === 'data')
      this.type = 'feeds';

  }

  connect(id) {

    this.id = id || this.id;

    this.client = mqtt.connect({
      host: this.host,
      port: this.port,
      protocol: (parseInt(this.port) === 8883 ? 'mqtts' : 'mqtt'),
      username: this.username,
      password: this.key,
      connectTimeout: 60 * 1000,
      keepalive: 3600
    });

    this.client.on('connect', () => {
      this.client.subscribe(`${this.username}/${this.type}/${this.id}/json`);
      this.connected = true;
      this.emit('connected');
    });

    this.client.on('reconnect', () => {
      this.client.subscribe(`${this.username}/${this.type}/${this.id}/json`);
      this.connected = true;
      this.emit('connected');
    });

    this.client.on('error', (err) => this.emit('error', err));

    this.client.on('offline', () => this.connected = false);

    this.client.on('close', () => this.connected = false);

    this.client.on('message', (topic, message) => {
      this.buffer.push(message);
      this.emit('message', message);
    });

  }

  _read() {

    if(! this.connected)
      return this.once('connected', () => this._read());

    if(this.buffer.length === 0)
      return this.once('message', () => this._read());

    try {
      this.push(this.buffer.shift());
    } catch(err) {
      this.emit('error', err);
      this.once('message', () => this._read());
    }

  }

  _write(data, encoding, next) {

    if(! this.connected)
      return this.once('connected', () => this._write(data, encoding, next));

    this.client.publish(`${this.username}/${this.type}/${this.id}`, data.toString().trim());

    next();

  }

}

exports = module.exports = Stream;
