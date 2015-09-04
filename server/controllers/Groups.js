'use strict';

var url = require('url');


var Groups = require('./GroupsService');


module.exports.groupsGet = function groupsGet (req, res, next) {
  

  var result = Groups.groupsGet();

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};

module.exports.getGroupById = function getGroupById (req, res, next) {
  var id = req.swagger.params['id'].value;
  

  var result = Groups.getGroupById(id);

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};
