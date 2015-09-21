const DuplexStream = require('stream').Duplex,
      mqtt = require('mqtt');

class Stream extends DuplexStream {

  constructor(username, key, id, options) {

    super();

    this.username = username;
    this.key = key;
    this.id = id;

    this._writableState.objectMode = true;

    this.connect();

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
      this.client.subscribe(this.username + '/f/' + this.id);
      this.connected = true;
      this.emit('connected');
    });

    this.client.on('offline', () => {
      this.connected = false;
    });

    this.client.on('close', () => {
      this.connected = false;
    });

    this.client.on('message', (topic, message) => {
      this.buffer.push(message);
      this.emit('message', message);
    });

  }

  _read() {

    if(! this.connected) {
      return this.once('connected', () => {
        this._read();
      });
    }

    if(this.buffer.length === 0) {
      return this.once('message', () => {
        this._read();
      });
    }

    this.push(this.buffer.shift());

  }

  _write(data, encoding, cb) {

    if(! this.connected) {
      return this.once('connected', () => {
        this._write(data, encoding, cb);
      });
    }

    if(! data || ! data.toString) {
      return cb('invalid data sent to feed');
    }

    this.client.publish(this.username + '/f/' + this.id, data.toString());
    cb();

  }

}

exports = module.exports = Stream;
