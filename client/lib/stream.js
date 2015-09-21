const DuplexStream = require('stream').Duplex,
      mqtt = require('mqtt');

class Stream extends DuplexStream {

  constructor(options) {

    super();

    this.type = 'f';
    this.host = 'io.adafruit.com';
    this.port = 8883;
    this.username = false;
    this.key = false;
    this.id = false;
    this.buffer = [];

    Object.assign(this, options || {});

    this._writableState.objectMode = true;

  }

  connect() {

    this.client = mqtt.connect({
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.key,
      keepalive: 3600
    });

    this.client.on('connect', () => {
      this.client.subscribe(`${this.username}/${this.type}/${this.id}`);
      this.connected = true;
      this.emit('connected');
    });

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

    this.push(this.buffer.shift());

  }

  _write(data, encoding, next) {

    if(! this.connected)
      return this.once('connected', () => this._write(data, encoding, next));

    if(! data || ! data.toString)
      return next('invalid data sent to feed');

    this.client.publish(`${this.username}/${this.type}/${this.id}`, data.toString(), next);

  }

}

exports = module.exports = Stream;
