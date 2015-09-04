require('../index');

var mqtt = require('mqtt');

describe('Tunnel', function() {

  describe('MQTTS', function() {

    it('should sucesssfully tunnel MQTT requests to AIO', function(done) {

      var client = mqtt.connect('mqtt://localhost:3001');

      client.on('connect', done);
      client.on('error', done);

    });

  });

});

