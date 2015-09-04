var AIO = require('../../index');

// create an instance
aio = AIO(
  process.env.AIO_USERNAME || 'username',
  process.env.AIO_KEY || 'xxxxxxxxxxxx'
);

// define the data to update
var update_data = {
  description: 'Testing updating a description'
};

// update the description of feed 'Test Feed Two'
aio.feeds('Test Feed Two').update(update_data, function(err, updated) {

  if(err) {
    return console.error(err);
  }

  // log updated feed
  console.log(updated);

});
