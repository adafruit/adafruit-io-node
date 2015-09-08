'use strict';

var util = require('util'),
    boom = require('boom'),
    model = require('../models/Feed.js');

module.exports.all = function all(req, res) {

  var groupId = req.swagger.params['group_id'].value;

  model.all(groupId)
    .then(function(data) {
      res.json(data);
    }).
    catch(function(err) {
      return reply(boom.badRequest('bad request'));
    });

};


module.exports.create = function create(req, res) {

  var feed = req.swagger.params['feed'].value;

  model.create(feed)
    .then(function(data) {
      res.json(data);
    }).
    catch(function(err) {
      return reply(boom.badRequest('bad request'));
    });

};


module.exports.get = function get(req, res) {

  var id = req.swagger.params['id'].value;

  model.get(id)
    .then(function(data) {
      res.json(data);
    }).
    catch(function(err) {
      return reply(boom.badRequest('bad request'));
    });

};


module.exports.replace = function replace(req, res) {

  var id = req.swagger.params['id'].value,
      feed = req.swagger.params['feed'].value;

  model.replace(id, feed)
    .then(function(data) {
      res.json(data);
    }).
    catch(function(err) {
      return reply(boom.badRequest('bad request'));
    });

};


module.exports.destroy = function destroy(req, res) {

  var id = req.swagger.params['id'].value;

  model.destroy(id)
    .then(function(data) {
      res.json(data);
    }).
    catch(function(err) {
      return reply(boom.badRequest('bad request'));
    });

};


module.exports.update = function update(req, res) {

  var id = req.swagger.params['id'].value,
      feed = req.swagger.params['feed'].value;

  model.update(id, feed)
    .then(function(data) {
      res.json(data);
    }).
    catch(function(err) {
      return reply(boom.badRequest('bad request'));
    });

};

