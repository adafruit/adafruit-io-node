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
  name: 'Test Feed 2',
  description: 'Testing adding a description'
};

aio.create_feed(feed_options, function(err, success) {

  if(err) {
    return console.error(err);
  }

  console.log(success ? 'created!' : 'creation failed :(');

});
```

[1]: http://nodejs.com
[2]: https://io.adafruit.com
[3]: https://learn.adafruit.com/adafruit-io/feeds
[4]: https://learn.adafruit.com/adafruit-io/api-key
