'use strict';

var util = require('util'),
    boom = require('boom'),
    model = require('../models/Group.js');

module.exports.groupsGet = function groupsGet(req, res) {

  

  model.groupsGet()
    .then(function(data) {
      res.json(data);
    }).
    catch(function(err) {
      return reply(boom.badRequest('bad request'));
    });

};


module.exports.getGroupById = function getGroupById(req, res) {

  var id = req.swagger.params['id'].value;

  model.getGroupById(id)
    .then(function(data) {
      res.json(data);
    }).
    catch(function(err) {
      return reply(boom.badRequest('bad request'));
    });

};

