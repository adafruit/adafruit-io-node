const nedb = require('nedb'),
      path = require('path');

const db = ({
  filename: path.join(__dirname, '..', 'adafruit-io.db')
});

db.ensureIndex({ fieldName: 'type', unique: true, sparse: true });
db.ensureIndex({ fieldName: 'Feed.id', unique: true, sparse: true });
db.ensureIndex({ fieldName: 'Feed.key', unique: true, sparse: true });
db.ensureIndex({ fieldName: 'Feed.name', unique: true, sparse: true });
db.ensureIndex({ fieldName: 'Data.id', unique: true, sparse: true });
db.ensureIndex({ fieldName: 'Group.id', unique: true, sparse: true });
db.ensureIndex({ fieldName: 'Group.key', unique: true, sparse: true });
db.ensureIndex({ fieldName: 'Group.name', unique: true, sparse: true });

exports = module.exports = db;
