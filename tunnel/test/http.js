require('../index');

var request = require('request');

describe('Tunnel', function() {

  describe('HTTPS', function() {

    it('should sucesssfully tunnel HTTP requests to AIO', function(done) {

      request('http://localhost:3000', function(err, response, body) {

        if(err || response.statusCode !== 200)
          done('Request failed');

        done();

      });

    });

  });

});
