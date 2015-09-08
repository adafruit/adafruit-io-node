'use strict';

var util = require('util'),
    boom = require('boom'),
    model = require('../models/Data.js');

module.exports.feedsFeedIdDataGet = function feedsFeedIdDataGet(req, res) {

  var feedId = req.swagger.params['feed_id'].value;

  model.feedsFeedIdDataGet(feedId)
    .then(function(data) {
      res.json(data);
    }).
    catch(function(err) {
      return reply(boom.badRequest('bad request'));
    });

};


module.exports.getDataById = function getDataById(req, res) {

  var feedId = req.swagger.params['feed_id'].value,
      dataId = req.swagger.params['data_id'].value;

  model.getDataById(feedId, dataId)
    .then(function(data) {
      res.json(data);
    }).
    catch(function(err) {
      return reply(boom.badRequest('bad request'));
    });

};

