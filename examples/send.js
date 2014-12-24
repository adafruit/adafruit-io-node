var AIO = require('../index');

// create an instance
aio = AIO(process.env.AIO_KEY || 'xxxxxxxxxxxx');

aio.send('Test Send Stream', 98.6, function(err, data) {

  if(err) {
    return console.error(err);
  }

  console.log(data);

});
