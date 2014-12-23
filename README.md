# adafruit-io

A [node.js][1] client for use with [io.adafruit.com][2].

## Installation

```
npm install adafruit-io
```

## Usage

To include this module in your project, you must pass your [AIO Key][4] to the `AIO` constructor.

```js

var AIO = require('adafruit-io');

aio = AIO('xxxxxxxxxxxx');

```

## Feeds

Feeds are the core of the Adafruit IO system. The feed holds metadata about data that gets pushed, and you will
have one feed for each type of data you send to the system. You can have separate feeds for each
sensor in a project, or you can use one feed to contain JSON encoded data for all of your sensors.

### Feed Creation

You have two options here, you can create a feed by passing a feed name, or you can pass an object if you would
like to define more properties.  If you would like to find information about what properties are available, please
visit the [Adafruit IO feed API docs][3].

```js
// option 1

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
```

### Feed Retrieval

You can get a list of your feeds by using the `aio.feeds(cb)` method.

```js
// create an instance
aio = AIO(process.env.AIO_KEY || 'xxxxxxxxxxxx');

// get a list of all feeds
aio.feeds(function(err, feeds) {

  if(err) {
    return console.error(err);
  }

  // log feeds array
  console.log(feeds);

});
```

You can also get a specific feed by ID, key, or name by using the `aio.feeds(id, cb)` method.

```js
aio.feeds('Test Feed Two', function(err, feed) {

  if(err) {
    return console.error(err);
  }

  // log feed object
  console.log(feed);

});
```
## Feed Updating

You can update [feed properties][3] using the `aio.feeds(id).update(data, cb)` method.

```js
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
```
## Feed Deletion

You can delete a feed by ID, key, or name by using the `aio.feeds(id).delete(cb)` method.

```js
// delete 'Test Feed Two' by key
aio.feeds('test-feed-two').delete(function(err, deleted) {

  if(err) {
    return console.error(err);
  }

  console.log(deleted ? 'Test Feed Two deleted!' : 'deletion failed :(');

});
```

[1]: http://nodejs.com
[2]: https://io.adafruit.com
[3]: https://learn.adafruit.com/adafruit-io/feeds
[4]: https://learn.adafruit.com/adafruit-io/api-key
