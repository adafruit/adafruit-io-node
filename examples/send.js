var AIO = require('../index');

// create an instance
aio = AIO(process.env.AIO_KEY || 'xxxxxxxxxxxx');

aio.send('Test Send', 'Test Value', function(err, success) {

  if(err) {
    return console.error(err);
  }

  console.log(success ? 'created stream!' : 'creation failed :(');

});
