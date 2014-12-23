var path = require('path'),
    AIO = require(path.resolve(__dirname, '..', '..', 'index.js'));

// create an instance
aio = AIO(process.env.AIO_KEY || 'xxxxxxxxxxxx');

// delete 'Test Feed Two' by name
aio.feeds('Test Feed Two').delete(function(err, deleted) {

  if(err) {
    return console.error(err);
  }

  console.log(deleted ? 'Test Feed Two deleted!' : 'deletion failed :(');

});
