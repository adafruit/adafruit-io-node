'use strict';

const nedb = require('nedb'),
      path = require('path');

const db = new nedb({
  filename: process.env.AIO_SERVER_DB || path.join(__dirname, '..', 'adafruit-io.db')
});

db.loadDatabase();

db.ensureIndex({ fieldName: 'type'});
db.ensureIndex({ fieldName: 'Feed.id', unique: true, sparse: true });
db.ensureIndex({ fieldName: 'Feed.key', unique: true, sparse: true });
db.ensureIndex({ fieldName: 'Feed.name', unique: true, sparse: true });
db.ensureIndex({ fieldName: 'Data.id', unique: true, sparse: true });
db.ensureIndex({ fieldName: 'Group.id', unique: true, sparse: true });
db.ensureIndex({ fieldName: 'Group.key', unique: true, sparse: true });
db.ensureIndex({ fieldName: 'Group.name', unique: true, sparse: true });

exports = module.exports = db;
