'use strict';

var SwaggerHapi = require('swagger-hapi');
var Hapi = require('hapi');
var app = new Hapi.Server();

module.exports = app;

var config = {
  appRoot: __dirname
};

SwaggerHapi.create(config, function(err, swaggerHapi) {

  if(err)
    throw err; 

  var port = process.env.HTTP_PORT || 8080;
  app.connection({ port: port });

  app.register(swaggerHapi.plugin, function(err) {

    if(err)
      return console.error('Failed to load plugin:', err);

    app.start(function() {
      console.log('[status] Adafruit IO is now ready at http://localhost:%d/api', port);
    });

  });

});

