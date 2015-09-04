var AIO = require('../../index');

// create an instance
aio = AIO(process.env.AIO_KEY || 'xxxxxxxxxxxx');

// get a list of all groups
aio.groups(function(err, data) {

  if(err) {
    return console.error(err);
  }

  // log data array
  console.log(data);

});

// get a specific group by name
aio.groups('Test', function(err, data) {

  if(err) {
    return console.error(err);
  }

  // log data object
  console.log(data);

});

