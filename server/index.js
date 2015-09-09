'use strict';

const swaggerTools = require('swagger-tools'),
      csv = require('express-csv'),
      api = require('./swagger.json'),
      hostname = require('os').hostname(),
      app = require('express')(),
      port = process.env.HTTP_PORT || 8080;

// swagger api overrides
api.host = `${hostname}:${port}`;
api.schemes = [
  'http'
];

swaggerTools.initializeMiddleware(api, function(middleware) {

  app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-AIO-Key, X-Requested-With, Content-Type, Accept");

    if(req.method != 'OPTIONS')
      return next();

    res.send();

  });

  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerValidator());
  app.use(middleware.swaggerRouter({
    swaggerUi: './swagger.json',
    controllers: './lib/controllers',
    useStubs: false
  }));
  app.use(middleware.swaggerUi());

  app.listen(port);
  console.log(`[status]  Adafruit IO is now ready at http://${hostname}:${port}/api`);

});

