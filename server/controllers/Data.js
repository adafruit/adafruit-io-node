'use strict';

var url = require('url');


var Data = require('./DataService');


module.exports.feedsFeedIdDataGet = function feedsFeedIdDataGet (req, res, next) {
  var feedId = req.swagger.params['feed_id'].value;
  

  var result = Data.feedsFeedIdDataGet(feedId);

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};

module.exports.getDataById = function getDataById (req, res, next) {
  var feedId = req.swagger.params['feed_id'].value;
  var dataId = req.swagger.params['data_id'].value;
  

  var result = Data.getDataById(feedId, dataId);

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};
