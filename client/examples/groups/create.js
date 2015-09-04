var AIO = require('../../index');

// create an instance
aio = AIO(process.env.AIO_KEY || 'xxxxxxxxxxxx');

aio.create_group({name: 'Test'}, function(err, success) {

  if(err) {
    return console.error(err);
  }

  console.log(success ? 'created group!' : 'creation failed :(');

});
