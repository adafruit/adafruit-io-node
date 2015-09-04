'use strict';

var app = require('connect')(),
    http = require('http'),
    swaggerTools = require('swagger-tools'),
    swaggerDoc = require('./api/swagger.json'),
    serverPort = process.env.AIO_PORT || 8080;

swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {

  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerValidator());
  app.use(middleware.swaggerUi());

  app.use(middleware.swaggerRouter({
    swaggerUi: '/swagger.json',
    controllers: './controllers',
    useStubs: false
  }));

  http.createServer(app).listen(serverPort, function() {
    console.log('[status] Adafruit IO is now ready at http://localhost:%d/api', serverPort, serverPort);
    console.log('[info] Documentation is available at http://localhost:%d/api/docs\n', serverPort);
  });

});
