'use strict';

const util = require('util'),
      xml = require('xml'),
      model = require('../models/Data');

module.exports.feedsFeedIdDataGet = function feedsFeedIdDataGet(req, res, next) {

  const feedId = req.swagger.params['feed_id'].value;

  model.feedsFeedIdDataGet(feedId)
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


module.exports.getDataById = function getDataById(req, res, next) {

  const feedId = req.swagger.params['feed_id'].value,
      dataId = req.swagger.params['data_id'].value;

  model.getDataById(feedId, dataId)
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

