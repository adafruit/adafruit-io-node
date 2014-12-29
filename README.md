# adafruit-io

A [node.js][1] client for use with [io.adafruit.com][2].

## Installation

You should have the latest stable version of node.js installed to use this module.

```
$ node -v
v0.10.35
```

After node.js is installed, you can install this package using [npm][5], which is bundled with node.js.

```
$ npm install adafruit-io
```

## Usage

To include this module in your project, you must pass your [AIO Key][4] to the `AIO` constructor.

```js

var AIO = require('adafruit-io');

// replace xxxxxxxxxxxx with your AIO Key
aio = AIO('xxxxxxxxxxxx');

```

## Table of Contents

* [Feeds](#feeds)
  * [Create](#feed-creation)
  * [Read](#feed-retrieval)
  * [Update](#feed-updating)
  * [Delete](#feed-deletion)
* [Streams](#streams)
  * [Create](#stream-creation)
  * [Read](#stream-retrieval)
  * [Update](#stream-updating)
  * [Delete](#stream-deletion)
  * [Helper Methods](#helper-methods)
    * [Send](#send)
    * [Next](#next)
    * [Last](#last)
    * [Previous](#previous)
  * [Readable](#readable-stream)
  * [Writable](#writable-stream)

### Feeds

Feeds are the core of the Adafruit IO system. The feed holds metadata about data that gets pushed, and you will
have one feed for each type of data you send to the system. You can have separate feeds for each
sensor in a project, or you can use one feed to contain JSON encoded data for all of your sensors.

#### Feed Creation

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

#### Feed Retrieval

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
#### Feed Updating

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
#### Feed Deletion

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

### Streams

Streams represent the data contained in feeds. You can read, add, modify, and delete streams. There are also
a few convienient methods for sending data to streams and selecting certain pieces of data.

#### Stream Creation

Streams can be created [after you create a feed](#stream-creation), by using the
`aio.feeds(id).create_stream(value, cb);` method.

```js
// assumes you have already created 'Test'
aio.feeds('Test').create_stream(10, function(err, success) {

  if(err) {
    return console.error(err);
  }

  console.log(success ? 'created stream!' : 'creation failed :(');

});
```

#### Stream Retrieval

You can get all of the stream data by using the `aio.feeds(id).streams(cb);` method. The
callback will be called with errors and the data array as arguments.

```js
// get an array of all data from feed 'Test'
aio.feeds('Test').streams(function(err, data) {

  if(err) {
    return console.error(err);
  }

  // log data array
  console.log(data);

});
```

You can also get a specific stream value by ID by using the `aio.feeds(id).streams(id, cb);` method.

```js
// get a specific stream value by id.
// this example assumes 1 is a valid stream ID in the 'Test' feed
aio.feeds('Test').streams(1, function(err, data) {

  if(err) {
    return console.error(err);
  }

  // log data object
  console.log(data);

});
```

#### Stream Updating

Stream values can be updated by using the `aio.feeds(id).streams(id).update(value, cb);` method.

```js
// update the value of stream 1
aio.feeds('Test')streams(1).update(5, function(err, updated) {

  if(err) {
    return console.error(err);
  }

  // log updated feed
  console.log(updated);

});

```

#### Stream Deletion

Stream values can be deleted by using the `aio.feeds(id).streams(id).delete(cb);` method.

```js
// delete stream ID 1 in `Test' feed
aio.feeds('Test').streams(1).delete(function(err, deleted) {

  if(err) {
    return console.error(err);
  }

  console.log(deleted ? 'data deleted!' : 'deletion failed :(');

});
```

#### Helper Methods

There are a few helper methods that can make interacting with streams a bit easier.

##### Send

You can use the `aio.send(name, value, cb);` method to find or create the feed based on the name passed,
and also create a stream based on the value passed.

```js
aio.('Test Send Stream', 98.6, function(err, data) {

  if(err) {
    return console.error(err);
  }

  console.log(data);

});

```

##### Last

You can get the last inserted value of the stream by using the `aio.feeds(id).last(cb);` method.

```js
aio.feeds('Test').last(function(err, data) {

  if(err) {
    return console.error(err);
  }

  // log data object
  console.log(data);

});

```

##### Next

You can get the first inserted stream that has not been processed by using the `aio.feeds(id).next(cb);` method.

```js
aio.feeds('Test').next(function(err, data) {

  if(err) {
    return console.error(err);
  }

  // log data object
  console.log(data);

});
```

##### Previous

You can get the the last record that has been processed by using the `aio.feeds(id).previous(cb);` method.

```js
aio.feeds('Test').previous(function(err, data) {

  if(err) {
    return console.error(err);
  }

  // log data object
  console.log(data);

});
```

#### Readable Stream

You can get a readable stream of live data from your feed by listening to the data event.

```js
aio.feeds('Test').on('data', function(data) {
  console.log(data.toString());
});
```

You can also pipe the live data, just like any node.js readable stream.

```js
aio.feeds('Test').pipe(process.stdout);
```

#### Writable Stream

You can use node's writable stream interface with any feed.

```js
aio.feeds('Test').write(100);
```

You can also pipe data to the stream, just like any node.js writable stream.

```js
process.stdin.pipe(aio.feeds('Test'));
```

## License
Copyright (c) 2014 Adafruit Industries. Licensed under the MIT license.

[1]: http://nodejs.org
[2]: https://io.adafruit.com
[3]: https://learn.adafruit.com/adafruit-io/feeds
[4]: https://learn.adafruit.com/adafruit-io/api-key
[5]: https://npmjs.com
