var AIO = require('../../index');

// create an instance
aio = AIO(
  process.env.AIO_USERNAME || 'username',
  process.env.AIO_KEY || 'xxxxxxxxxxxx'
);

// get a list of all data from 'Test'
aio.feeds('Test').data(function(err, data) {

  if(err) {
    return console.error(err);
  }

  // log data array
  console.log(data);

});

// get a specific value by id (assumes 1 is a valid data id in this feed)
aio.feeds('Test').data(1, function(err, data) {

  if(err) {
    return console.error(err);
  }

  // log data object
  console.log(data);

});

