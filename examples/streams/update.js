var AIO = require('../../index');

// create an instance
aio = AIO(process.env.AIO_KEY || 'xxxxxxxxxxxx');

// update the value of stream 1
aio.feeds('Test')streams(1).update(5, function(err, updated) {

  if(err) {
    return console.error(err);
  }

  // log updated feed
  console.log(updated);

});
