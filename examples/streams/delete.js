var AIO = require('../../index');

// create an instance
aio = AIO(process.env.AIO_KEY || 'xxxxxxxxxxxx');

// delete stream ID 1 in Test feed
aio.feeds('Test').streams(1).delete(function(err, deleted) {

  if(err) {
    return console.error(err);
  }

  console.log(deleted ? 'data deleted!' : 'deletion failed :(');

});
