var tunnel = require('./lib/tunnel');

// proxy http connections
var http = tunnel({
  host: 'io.adafruit.com',
  port: 443
});

http.listen(process.env.AIO_TUNNEL_HTTP || 8888);

// proxy mqtt connections
var mqtt = tunnel({
  host: 'io.adafruit.com',
  port: 8883
});

mqtt.listen(process.env.AIO_TUNNEL_MQTT || 1883);
