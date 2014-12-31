var AIO = require('../../index');

// create an instance
aio = AIO(process.env.AIO_KEY || 'xxxxxxxxxxxx');

aio.groups('Test').previous(function(err, data) {

  if(err) {
    return console.error(err);
  }

  // log data object
  console.log(data);

});

