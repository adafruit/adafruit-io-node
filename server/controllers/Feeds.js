'use strict';

var url = require('url');


var Feeds = require('./FeedsService');


module.exports.all = function all (req, res, next) {
  var groupId = req.swagger.params['group_id'].value;
  

  var result = Feeds.all(groupId);

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};

module.exports.create = function create (req, res, next) {
  var feed = req.swagger.params['feed'].value;
  

  var result = Feeds.create(feed);

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};

module.exports.get = function get (req, res, next) {
  var id = req.swagger.params['id'].value;
  

  var result = Feeds.get(id);

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};

module.exports.replace = function replace (req, res, next) {
  var id = req.swagger.params['id'].value;
  var feed = req.swagger.params['feed'].value;
  

  var result = Feeds.replace(id, feed);

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};

module.exports.destroy = function destroy (req, res, next) {
  var id = req.swagger.params['id'].value;
  

  var result = Feeds.destroy(id);

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};

module.exports.update = function update (req, res, next) {
  var id = req.swagger.params['id'].value;
  var feed = req.swagger.params['feed'].value;
  

  var result = Feeds.update(id, feed);

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};
