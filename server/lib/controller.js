class Controller {

  static handleResponse(res, data) {
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
  }

  static handleError(res, err) {
    res.format({
      'application/json': function() {
        res.status(500).json({ error: err });
      },
      'text/csv': function() {
        res.status(500).csv(err);
      },
      'application/xml': function() {
        res.set('Content-Type', 'text/xml');
        res.status(500).send(xml({ error: err }));
      },
      'text/html': function() {
        res.set('Content-Type', 'application/json');
        res.status(500).json({ error: err });
      },
      'default': function() {
        res.set('Content-Type', 'application/json');
        res.status(500).json({ error: err });
      }
    });
  }

}

exports = module.exports = Controller;
