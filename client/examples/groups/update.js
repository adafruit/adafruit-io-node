var AIO = require('../../index');

// create an instance
aio = AIO(process.env.AIO_KEY || 'xxxxxxxxxxxx');

// update the name of group 'Test'
aio.groups('Test').update({name: 'TestTwo'}, function(err, updated) {

  if(err) {
    return console.error(err);
  }

  // log updated group
  console.log(updated ? updated : 'update failed');

});
