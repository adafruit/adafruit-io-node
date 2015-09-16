var AIO = require('../../index');

// create an instance
aio = AIO(
  process.env.AIO_USERNAME || 'username',
  process.env.AIO_KEY || 'xxxxxxxxxxxx'
);

// assumes you have already created 'Test'
aio.feeds('Test').create_data(10, function(err, success) {

  if(err) {
    return console.error(err);
  }

  console.log(success ? 'created data!' : 'creation failed :(');

});
