var tunnel = require('./lib/tunnel');

// proxy http connections
var http = tunnel({
  host: 'io.adafruit.com',
  port: 443
});

http.listen(process.env.TUNNEL_HTTP_PORT || 80);

// proxy mqtt connections
var mqtt = tunnel({
  host: 'io.adafruit.com',
  port: 8883
});

mqtt.listen(process.env.TUNNEL_MQTT_PORT || 1883);
