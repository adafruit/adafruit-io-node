# Node.js Adafruit IO Client

A [node.js][1] client for use with [io.adafruit.com][2].

## Installation

You should have the latest stable version of [node.js][1] installed to use this module.

```
$ node -v
v0.12.7
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
aio = AIO('your_username', 'xxxxxxxxxxxx');

```

## Table of Contents

* [Feeds](#feeds)
  * [Create](#feed-creation)
  * [Read](#feed-retrieval)
  * [Update](#feed-updating)
  * [Delete](#feed-deletion)
* [Data](#data)
  * [Create](#data-creation)
  * [Read](#data-retrieval)
  * [Update](#data-updating)
  * [Delete](#data-deletion)
  * [Helper Methods](#helper-methods)
    * [Send](#send)
    * [Next](#next)
    * [Last](#last)
    * [Previous](#previous)
  * [Readable](#readable-data)
  * [Writable](#writable-data)
* [Groups](#groups)
  * [Create](#group-creation)
  * [Read](#group-retrieval)
  * [Update](#group-updating)
  * [Delete](#group-deletion)

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
aio = AIO('your_username', 'xxxxxxxxxxxx');

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

### Data

Data represents the data contained in feeds. You can read, add, modify, and delete data. There are also
a few convienient methods for sending data to feeds and selecting certain pieces of data.

#### Data Creation

Data can be created [after you create a feed](#data-creation), by using the
`aio.feeds(id).create_data(value, cb);` method.

```js
// assumes you have already created 'Test'
aio.feeds('Test').create_data(10, function(err, success) {

  if(err) {
    return console.error(err);
  }

  console.log(success ? 'created data!' : 'creation failed :(');

});
```

#### Data Retrieval

You can get all of the data data by using the `aio.feeds(id).data(cb);` method. The
callback will be called with errors and the data array as arguments.

```js
// get an array of all data from feed 'Test'
aio.feeds('Test').data(function(err, data) {

  if(err) {
    return console.error(err);
  }

  // log data array
  console.log(data);

});
```

You can also get a specific value by ID by using the `aio.feeds(id).data(id, cb);` method.

```js
// get a specific value by id.
// this example assumes 1 is a valid data ID in the 'Test' feed
aio.feeds('Test').data(1, function(err, data) {

  if(err) {
    return console.error(err);
  }

  // log data object
  console.log(data);

});
```

#### Data Updating

Values can be updated by using the `aio.feeds(id).data(id).update(value, cb);` method.

```js
// update the value of ID 1
aio.feeds('Test')data(1).update(5, function(err, updated) {

  if(err) {
    return console.error(err);
  }

  // log updated value
  console.log(updated);

});

```

#### Data Deletion

Values can be deleted by using the `aio.feeds(id).data(id).delete(cb);` method.

```js
// delete data ID 1 in `Test' feed
aio.feeds('Test').data(1).delete(function(err, deleted) {

  if(err) {
    return console.error(err);
  }

  console.log(deleted ? 'data deleted!' : 'deletion failed :(');

});
```

#### Helper Methods

There are a few helper methods that can make interacting with data a bit easier.

##### Send

You can use the `aio.send(name, value, cb);` method to find or create the feed based on the name passed,
and also save the value passed.

```js
aio.send('Test Send Data', 98.6, function(err, data) {

  if(err) {
    return console.error(err);
  }

  console.log(data);

});

```

##### Last

You can get the last inserted value by using the `aio.feeds(id).last(cb);` method.

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

You can get the first inserted value that has not been processed by using the `aio.feeds(id).next(cb);` method.

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

You can also pipe the live data, just like any node.js readable data.

```js
aio.feeds('Test').pipe(process.stdout);
```

#### Writable Stream

You can use node's writable stream interface with any feed.

```js
aio.feeds('Test').write(100);
```

You can also pipe data to the stream, just like any node.js writable data.

```js
process.stdin.pipe(aio.feeds('Test'));
```

### Groups

Groups allow you to update and retrieve multiple feeds with one request. You can add feeds
to multiple groups.

#### Group Creation

You can create a group by passing an object of group properties.  If you would like to find
information about what properties are available, please visit the [Adafruit IO group API docs][6].

```js
aio.create_group({name: 'Test'}, function(err, success) {

  if(err) {
    return console.error(err);
  }

  console.log(success ? 'created group!' : 'creation failed :(');

});
```

#### Group Retrieval

You can get a list of your groups by using the `aio.groups(cb)` method.

```js
// get a list of all groups
aio.groups(function(err, data) {

  if(err) {
    return console.error(err);
  }

  // log data array
  console.log(data);

});
```

You can also get a specific group by ID, key, or name by using the `aio.groups(id, cb)` method.

```js
// get a specific group by name
aio.groups('Test', function(err, data) {

  if(err) {
    return console.error(err);
  }

  // log data object
  console.log(data);

});
```
#### Group Updating

You can update [group properties][6] using the `aio.groups(id).update(data, cb)` method.

```js
// update the name of group 'Test'
aio.groups('Test').update({name: 'TestTwo'}, function(err, updated) {

  if(err) {
    return console.error(err);
  }

  // log updated group
  console.log(updated ? updated : 'update failed');

});
```

#### Group Deletion

You can delete a group by ID, key, or name by using the `aio.group(id).delete(cb)` method.

```js
// delete group 'Test'
aio.groups('Test').delete(function(err, deleted) {

  if(err) {
    return console.error(err);
  }

  console.log(deleted ? 'group deleted!' : 'deletion failed :(');

});
```

## License
Copyright (c) 2014 Adafruit Industries. Licensed under the MIT license.

[1]: http://nodejs.org
[2]: https://io.adafruit.com
[3]: https://learn.adafruit.com/adafruit-io/feeds
[4]: https://learn.adafruit.com/adafruit-io/api-key
[5]: https://npmjs.com
[6]: https://learn.adafruit.com/adafruit-io/groups
