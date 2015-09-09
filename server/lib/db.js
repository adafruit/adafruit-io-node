const levelQuery = require('level-queryengine'),
      jsonqueryEngine = require('jsonquery-engine'),
      level = require('level'),
      path = require('path');

const db = levelQuery(
  level(path.join(__dirname, '..', 'db'), {valueEncoding: 'json'})
);

db.query.use(jsonqueryEngine());

db.ensureIndex('Feed.id');
db.ensureIndex('Feed.name');
db.ensureIndex('Feed.key');

exports = module.exports = db;
