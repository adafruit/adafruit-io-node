'use strict';

const util = require('util'),
      xml = require('xml'),
      model = require('../models/Feed');

module.exports.all = function all(req, res, next) {

  const groupId = req.swagger.params['group_id'].value;

  model.all(groupId)
    .then(function(data) {
      res.format({
        'application/json': function() {
          res.json(data);
        },
        'text/csv': function() {
          res.csv(data);
        },
        'application/xml': function() {
          res.set('Content-Type', 'text/xml');
          res.send(xml(data));
        },
        'text/html': function() {
          res.set('Content-Type', 'application/json');
          res.json(data);
        },
        'default': function() {
          res.set('Content-Type', 'application/json');
          res.json(data);
        }
      });
    }).
    catch(function(err) {
      res.writeHead(500);
      res.end();
    });

};


module.exports.create = function create(req, res, next) {

  const feed = req.swagger.params['feed'].value;

  model.create(feed)
    .then(function(data) {
      res.format({
        'application/json': function() {
          res.json(data);
        },
        'text/csv': function() {
          res.csv(data);
        },
        'application/xml': function() {
          res.set('Content-Type', 'text/xml');
          res.send(xml(data));
        },
        'text/html': function() {
          res.set('Content-Type', 'application/json');
          res.json(data);
        },
        'default': function() {
          res.set('Content-Type', 'application/json');
          res.json(data);
        }
      });
    }).
    catch(function(err) {
      res.writeHead(500);
      res.end();
    });

};


module.exports.get = function get(req, res, next) {

  const id = req.swagger.params['id'].value;

  model.get(id)
    .then(function(data) {
      res.format({
        'application/json': function() {
          res.json(data);
        },
        'text/csv': function() {
          res.csv(data);
        },
        'application/xml': function() {
          res.set('Content-Type', 'text/xml');
          res.send(xml(data));
        },
        'text/html': function() {
          res.set('Content-Type', 'application/json');
          res.json(data);
        },
        'default': function() {
          res.set('Content-Type', 'application/json');
          res.json(data);
        }
      });
    }).
    catch(function(err) {
      res.writeHead(500);
      res.end();
    });

};


module.exports.replace = function replace(req, res, next) {

  const id = req.swagger.params['id'].value,
      feed = req.swagger.params['feed'].value;

  model.replace(id, feed)
    .then(function(data) {
      res.format({
        'application/json': function() {
          res.json(data);
        },
        'text/csv': function() {
          res.csv(data);
        },
        'application/xml': function() {
          res.set('Content-Type', 'text/xml');
          res.send(xml(data));
        },
        'text/html': function() {
          res.set('Content-Type', 'application/json');
          res.json(data);
        },
        'default': function() {
          res.set('Content-Type', 'application/json');
          res.json(data);
        }
      });
    }).
    catch(function(err) {
      res.writeHead(500);
      res.end();
    });

};


module.exports.destroy = function destroy(req, res, next) {

  const id = req.swagger.params['id'].value;

  model.destroy(id)
    .then(function(data) {
      res.format({
        'application/json': function() {
          res.json(data);
        },
        'text/csv': function() {
          res.csv(data);
        },
        'application/xml': function() {
          res.set('Content-Type', 'text/xml');
          res.send(xml(data));
        },
        'text/html': function() {
          res.set('Content-Type', 'application/json');
          res.json(data);
        },
        'default': function() {
          res.set('Content-Type', 'application/json');
          res.json(data);
        }
      });
    }).
    catch(function(err) {
      res.writeHead(500);
      res.end();
    });

};


module.exports.update = function update(req, res, next) {

  const id = req.swagger.params['id'].value,
      feed = req.swagger.params['feed'].value;

  model.update(id, feed)
    .then(function(data) {
      res.format({
        'application/json': function() {
          res.json(data);
        },
        'text/csv': function() {
          res.csv(data);
        },
        'application/xml': function() {
          res.set('Content-Type', 'text/xml');
          res.send(xml(data));
        },
        'text/html': function() {
          res.set('Content-Type', 'application/json');
          res.json(data);
        },
        'default': function() {
          res.set('Content-Type', 'application/json');
          res.json(data);
        }
      });
    }).
    catch(function(err) {
      res.writeHead(500);
      res.end();
    });

};

