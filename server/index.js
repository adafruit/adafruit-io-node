'use strict';

const swaggerTools = require('swagger-tools'),
      csv = require('express-csv'),
      api = require('./swagger.json'),
      hostname = require('os').hostname(),
      app = require('express')(),
      path = require('path'),
      port = process.env.AIO_SERVER_PORT || 8080;

// swagger api overrides
api.host = `${hostname}:${port}`;
api.schemes = [
  'http'
];

const AIO_KEY = process.env.AIO_SERVER_KEY || '';

swaggerTools.initializeMiddleware(api, function(middleware) {

  app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-AIO-Key, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PATCH, PUT, DELETE, POST");

    if(req.method !== 'OPTIONS')
      return next();

    res.send();

  });

  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerSecurity({
    HeaderKey: function(req, def, scopes, next) {

      if(req.headers['x-aio-key'] === AIO_KEY)
        return next();

      next(new Error('unauthorized'));

    },
    QueryKey: function(req, def, scopes, next) {

      if(req.query['x-aio-key'] === AIO_KEY || req.query['X-AIO-Key'] === AIO_KEY)
        return next();

      next(new Error('unauthorized'));

    }
  }));

  app.use(middleware.swaggerValidator());
  app.use(middleware.swaggerRouter({
    controllers: path.join(__dirname, 'lib', 'controllers'),
    useStubs: false
  }));
  app.use(middleware.swaggerUi({
    apiDocs: '/api/docs/api.json',
    swaggerUi: '/api/docs',
    swaggerUiDir: path.join(__dirname, 'docs')
  }));

  app.get('/', function(req, res) {
    res.redirect('/api/docs');
  });

  app.get('/api', function(req, res) {
    res.redirect('/api/docs');
  });

  app.use(function(err, req, res, next) {
    res.send(err.message);
  });

  app.listen(port);
  console.log(`[status]  Adafruit IO is now ready at http://${hostname}:${port}/`);

});

exports = module.exports = app;
