/************************ DEPENDENCIES *****************************/
var mosca = require('mosca'),
    util = require('util'),
    stream = require('stream'),
    redis = require('redis'),
    bunyan = require('bunyan'),
    Auth = require('./auth');

util.inherits(MQTT, stream.Duplex);
var proto = MQTT.prototype;
exports = module.exports = MQTT;

/************************* CONSTRUCTOR ****************************/
function MQTT(config) {

  if (! (this instanceof MQTT))
    return new MQTT(config);

  stream.Duplex.call(this, {
    readableObjectMode: true,
    writableObjectMode: true
  });

  util._extend(this, config || {});

  if(! this.log)
    this.log = bunyan.createLogger({name: 'adafruit-io-mqtt'});

  this.start();

}

/*************************** DEFAULTS *****************************/
proto.port = 1883;
proto.redis_host = '127.0.0.1';
proto.redis_port = 6379;
proto.cache = [];
proto.log = false;
proto.broker = false;
proto.auth = false;
proto.ready = false;
proto.http_port = false;

/************************* BROKER METHODS *************************/
proto.start = function() {

  // if auth wasn't passed in the config, init a new one
  if(! this.auth) {
    this.auth = Auth({
      log: this.log.child({
        type: 'mqtt-auth'
      })
    });
  }

  // already started, so return
  if(this.broker)
    return;

  // build broker options
  var broker_options = {
    port: this.port,
    backend: {
      type: 'redis',
      sub_conn: redis.createClient(this.redis_port, this.redis_host),
      pub_conn: redis.createClient(this.redis_port, this.redis_host)
    },
    persistence: {
      factory: mosca.persistence.Redis,
      port:this.redis_port,
      host: this.redis_host
    }
  };

  // serve mqtt over websockets
  if(this.http_port) {
    broker_options.http = {
      port: this.http_port,
      bundle: true
    };
  }

  // init new MQTT broker
  this.broker = new mosca.Server(broker_options, this.onReady.bind(this));

  this.broker.on('published', this.onMessage.bind(this));
  this.broker.on('clientConnected', this.onConnection.bind(this));

};

proto.stop = function(callback) {

  if(this.broker)
    this.broker.close(callback);

};

proto.handleThrottle = function(username, seconds, rate, period) {

  var self = this;

  var message = seconds + ' seconds until reset. current limit is ' +
                rate + ' requests every ' + period + ' seconds.';

  var packet = {
    topic: [username, 'throttle'].join('/'),
    payload: message,
    qos: 0,
    retain: true
  };

  this.broker.publish(packet, function() {
    self.log.debug('throttle published', username);
  });

};

proto.publish = function(packet) {

  var self = this;

  return new Promise(function(resolve, reject) {

    self.broker.publish(packet, function() {
      self.log.debug('published', packet);
      resolve();
    });

  });

};

/************************ BROKER CALLBACKS ************************/
proto.onReady = function() {
  this.broker.authenticate = this.authenticate.bind(this);
  this.broker.authorizePublish = this.authorizePublish.bind(this);
  this.broker.authorizeSubscribe = this.authorizeSubscribe.bind(this);
  this.log.debug('mqtt broker ready');
  this.ready = true;
  this.emit('ready');
};

proto.onConnection = function(client) {
  this.log.debug('mqtt connection', client.id);
};

proto.onMessage = function(packet, client) {

  // this mqtt packet came from the server
  if(! client)
    return;

  if(/^\$SYS/.test(packet.topic))
    return;

  this.log.debug('mqtt message', packet);
  this.cache.push(packet);
  this.emit('packet', packet);

};

/************************ AUTH CALLBACKS **************************/
proto.authenticate = function(client, username, key, callback) {

  if (! this.auth)
    return callback(null, false);

  if(! username && ! key)
    return callback(null, true);

  this.auth.authenticate(username, key, function(authorized) {

    if (authorized)
      client.username = username;

    callback(null, authorized);

  });

};

proto.authorizePublish = function(client, topic, payload, callback) {

  var success = (client.username == topic.split('/')[0]);

  this.log.debug(topic, client.username, success);

  callback(null, success);

};

proto.authorizeSubscribe = function(client, topic, callback) {

  topic = topic.split('/');

  var success = (client.username == topic[0]);

  this.log.debug(topic, client.username, success);

  if(success)
    return callback(null, true);

  if(topic.length < 3)
    return callback(null, false);

  if(topic[1] === 'dashboard' && topic[4] === 'public')
    return callback(null, true);

  this.auth.isPublic(topic[0], this.topicToType(topic[1]), topic[2])
    .then(function(pub) {
      callback(null, pub);
    })
    .catch(function(err) {
      callback(err);
    });

};

/********************* TYPE CONVERSION *************************/
proto.topicToType = function(topic) {

  switch(topic) {
    case 'g':
    case 'groups':
      return 'group';
    case 'f':
    case 'feeds':
      return 'feed';
    case 'b':
    case 'blocks':
      return 'block';
    case 's':
    case 'streams':
      return 'stream';
    case 't':
    case 'tokens':
      return 'token';
    default:
      return false;
  }

};

proto.typeToShort = function(t) {
  return t.charAt(0);
};

proto.typeToLong = function(t) {
  return t + 's';
};

/********************** PUBLISH HELPERS *************************/
proto.publishDashboard = function(message) {

  var topic = [
    message.username,
    'dashboard',
    message.type,
    message.action
  ];

  var packet = {
    topic: topic.join('/'),
    payload: JSON.stringify(message.payload),
    qos: 1,
    retain: false
  };

  var promise = this.publish(packet);

  if(! message.public)
    return promise;

  topic.push('public');

  packet.topic = topic.join('/');

  return promise.then(this.publish.bind(this, packet));

};

proto.publishGroup = function(message) {

  var promise = this.publishIDKeyName(
    message,
    JSON.stringify(message.payload),
    'json'
  );

  if(! message.payload.feeds || ! Object.keys(message.payload.feeds))
    return promise;

  promise = promise.then(this.publishIDKeyName.bind(
   this,
   message,
   JSON.stringify(message.payload)
  ));

  var csv = '';
  for(var key in message.payload.feeds)
    csv += key + ',' + message.payload.feeds[key] + '\n';

  promise = promise.then(this.publishIDKeyName.bind(
   this,
   message,
   csv,
   'csv'
  ));

  var valid = function(val) {
    return typeof val == 'number' || typeof val == 'string';
  };

  if(! message.payload.location)
    return promise;

  if(! valid(message.payload.location.lat))
    return promise;

  promise = promise.then(this.publishIDKeyName.bind(
   this,
   message,
   message.payload.location.lat.toString(),
   'lat'
  ));

  if(! valid(message.payload.location.lon))
    return promise;

  promise = promise.then(this.publishIDKeyName.bind(
   this,
   message,
   message.payload.location.lon.toString(),
   'lon'
  ));

  if(! valid(message.payload.location.ele))
    return promise;

  promise = promise.then(this.publishIDKeyName.bind(
   this,
   message,
   message.payload.location.ele.toString(),
   'ele'
  ));

  return promise;

};

proto.publishFeed = function(message) {

 var promise = this.publishIDKeyName(
   message,
   JSON.stringify(message.payload),
   'json'
  );

  if(! message.payload.last_value)
    return promise;

  promise = promise.then(this.publishIDKeyName.bind(
    this,
    message,
    message.payload.last_value
  ));

  var valid = function(val) {
    return typeof val == 'number' || typeof val == 'string';
  };

  if(! message.payload.last_geo)
    return promise;

  if(! valid(message.payload.last_geo.lat))
    return promise;

  promise = promise.then(this.publishIDKeyName.bind(
   this,
   message,
   message.payload.last_geo.lat.toString(),
   'lat'
  ));

  if(! valid(message.payload.last_geo.lon))
    return promise;

  promise = promise.then(this.publishIDKeyName.bind(
   this,
   message,
   message.payload.last_geo.lon.toString(),
   'lon'
  ));

  if(! valid(message.payload.last_geo.ele))
    return promise;

  promise = promise.then(this.publishIDKeyName.bind(
   this,
   message,
   message.payload.last_geo.ele.toString(),
   'ele'
  ));

  var csv = message.payload.last_value;
  csv += ',' + message.payload.last_geo.lat;
  csv += ',' + message.payload.last_geo.lon;
  csv += ',' + message.payload.last_geo.ele;

  promise = promise.then(this.publishIDKeyName.bind(
   this,
   message,
   csv,
   'csv'
  ));

  return promise;

};

proto.publishIDKeyName = function(message, payload, suffix) {

  var packet, args, promise;

  // long id
  args = [
    message.username,
    message.payload.id,
    payload,
    message.type,
    false,
    suffix
  ];
  packet = this.toPacket.apply(this, args);
  promise = this.publish(packet);

  // short id
  args[4] = true;
  packet = this.toPacket.apply(this, args);
  promise = promise.then(this.publish.bind(this, packet));

  // long key
  args[1] = message.payload.key;
  args[4] = false;
  packet = this.toPacket.apply(this, args);
  promise = promise.then(this.publish.bind(this, packet));

  // short key
  args[4] = true;
  packet = this.toPacket.apply(this, args);
  promise = promise.then(this.publish.bind(this, packet));

  // no need to continue
  if(message.payload.key === message.payload.name)
    return promise;

  // long name
  args[1] = message.payload.name;
  args[4] = false;
  packet = this.toPacket.apply(this, args);
  promise = promise.then(this.publish.bind(this, packet));

  // short name
  args[4] = true;
  packet = this.toPacket.apply(this, args);
  promise = promise.then(this.publish.bind(this, packet));

  return promise;

};

proto.parseFeedCSV = function(payload) {

  var csv =  payload.toString().split(',');

  if(csv.length < 2)
    return payload;

  return JSON.stringify({
    value: csv[0].toString().trim(),
    lat: (csv[1] || 0).toString().trim(),
    lon: (csv[2] || 0).toString().trim(),
    ele: (csv[3] || 0).toString().trim()
  });

};

proto.parseGroupCSV = function(payload) {

  var lines = payload.toString().split('\n');

  payload = { feeds: {}};

  lines.forEach(function(line) {

    line = line.toString().split(',');

    if(line.length < 2)
      return;

    if(line[0].trim() === 'location') {

      payload.location = {
        lat: (line[1] || 0).toString().trim(),
        lon: (line[2] || 0).toString().trim(),
        ele: (line[3] || 0).toString().trim()
      };

    }

    payload.feeds[line[0].trim()] = line[1].trim();

  });

  return JSON.stringify(payload);

};

proto.toMessage = function(packet) {

  var topic = packet.topic.split('/'),
      type = this.topicToType(topic[1]);

  // keep reading if the type was invalid
  if(! type) {
    this.log.debug('invalid type', topic[1]);
    return false;
  }

  if(topic[3] === 'csv') {

    try {

      if(type === 'feed')
        packet.payload = this.parseFeedCSV(packet.payload);
      else if(type === 'group')
        packet.payload = this.parseGroupCSV(packet.payload);

    } catch (e) {
      this.log.error(e);
    }

  }

  // build up common message format for stream modules
  var message = {
    username: topic[0],
    type: type,
    id: topic[2],
    payload: packet.payload
  };

  return message;

};

proto.toPacket = function(username, id, payload, type, short, suffix) {

  var topic;

  if(! short)
    type = this.typeToLong(type);
  else
    type = this.typeToShort(type);

  topic = [username, type, id];

  if(suffix)
    topic = topic.concat(suffix);

  return {
    topic: topic.join('/'),
    payload: payload,
    qos: 1,
    retain: true
  };

};

/************************** READABLE ****************************/
proto._read = function() {

  // wait until we have a new packet
  if(! this.cache.length)
    return this.once('packet', this._read.bind(this));

  var packet = this.cache.shift(),
      message = this.toMessage(packet);

  if(! message)
    return this.once('packet', this._read.bind(this));

  this.log.debug('read', message);

  this.push(message);

};

/************************** WRITABLE ****************************/
proto._write = function(message, enc, next) {

  if(! this.ready)
    return this.once('ready', this._write.bind(this, message, enc, next));

  var self = this,
      publish = this.publishDashboard(message);

  if(message.type === 'group') {
    this.log.debug('attempting group publish', message);
    publish = publish.then(this.publishGroup.bind(this, message));
  } else if(message.type === 'feed') {
    this.log.debug('attempting feed publish', message);
    publish = publish.then(this.publishFeed.bind(this, message));
  }

  publish.then(function() {
    self.log.debug('write', message);
    next();
  }).catch(function(e) {
    self.log.error('write error', e.stack || e);
    next();
  });

};

