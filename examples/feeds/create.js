var path = require('path'),
    AIO = require(path.resolve(__dirname, '..', '..', 'index.js'));

// create an instance
aio = AIO(process.env.AIO_KEY || 'xxxxxxxxxxxx');

// option 1:
// only pass a name
aio.create_feed('Test Feed', function(err, success) {

  if(err) {
    return console.error(err);
  }

  console.log(success ? 'created!' : 'creation failed :(');

});


// option 2:
// defining additional options
var feed_options = {
  name: 'Test Feed Two',
  description: 'Testing adding a description'
};

aio.create_feed(feed_options, function(err, success) {

  if(err) {
    return console.error(err);
  }

  console.log(success ? 'created!' : 'creation failed :(');

});
