# Adafruit IO
A Node.js Adafruit IO Client, Local Server, & io.adafruit.com TLS Tunnel.

## Installation
Make sure you have the latest stable version of [Node.js][3] installed on your computer.

```console
$ node -v
v0.12.6
```
Install `forever` and `adafruit-io` on your computer using `npm`.

```console
$ npm install -g forever adafruit-io
```

You can also optionally install `forever-service` if you are using a Linux distro, and would like to run the server as a service.

```console
$ npm install -g forever-service
```
## Table of Contents
* [Server](#server)
* [TLS Tunnel](#tls-tunnel)
  * [Security Considerations](#security-considerations)
  * [Usage](#usage)
* [Client](#client)
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

## Help
View the available sub commands for `adafruit-io`:

```console
$ adafruit-io help

  Usage: adafruit-io [options] [command]


  Commands:

    server [cmd]  Local Adafruit IO server
    tunnel [cmd]  io.adafruit.com TLS tunnel
    help [cmd]    display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

The three main commands available are `service`, `tunnel`, and `help`.

## Server
The server included in this package is an open source API compatible version of
Adafruit IO that you can run locally. Future additions to io.adafruit.com will
allow you to sync your local data with the hosted service.

## Usage
Let's look at the available commands for `adafruit-io server`:

```console
$ adafruit-io help server

  Usage: adafruit-io server [options] [command]


  Commands:

    install   installs server service (linux only)
    remove    removes server service (linux only)
    start     starts server daemon
    restart   restarts server daemon
    stop      stops server daemon

  Options:

    -h, --help      output usage information
    -V, --version   output the version number
    -p, --port <n>  http port
```

To start the server daemon, you can run the following command on the default port of `8080`:
```console
$ adafruit-io server start
                                     ▄▄
                                   ▄████
                                 ▄███████
                                █████████▌
                               ███████████
                              ████████████▌
             ███████████████▄ ████████████▌
              █████████████████████▀▀█████ ▄▄▄▄▄▄▄
               ▐██████████████████   █████████████████▄▄
                 ▀█████████  ▀▀███  ██████████████████████
                   █████████▄▄  ▐████▀    ▐█████████████▀
                     ▀▀███████████████▄▄█████████████▀
                      ▄███████   ██  ▀████████████▀
                     ███████▀  ▄████  ▐█████▄
                    █████████████████▄▄██████▄
                   ███████████████████████████
                  ██████████████ ▐████████████▌
                 ▐██████████▀▀    ▀███████████▌
                 █████▀▀            ▀█████████▌
                                       ▀██████
                                          ▀███
----------------------------------------------------------------------
                           adafruit io
----------------------------------------------------------------------
[status]  starting server...
[status]  adafruit io is now ready at http://localhost:8080/api
[info]    documentation is available at http://localhost:8080/api/docs
```
The server will stay up until you shut down your computer, or stop the server.
To stop the server, run the following command:

```console
$ adafruit-io server stop
[status] stopping server...
```

If you would like to run the server on a different port, you can use the `-p` option
to set the port you wish to use. **Note**: As as a general rule processes running
without root privileges cannot bind to ports below 1024. Use a port > 1024, or run
the server using elevated privileges via `sudo`, but this is not recommended.

## TLS Tunnel
This is a TLS/SSL tunnel for securely connecting HTTP and MQTT clients to io.adafruit.com.
Instead of pointing your MQTT or HTTP client at io.adafruit.com, use the IP address
or hostname of the computer you are running the tunnel on.

### HTTP
Requests to port 8888 on the Pi will be tunneled to HTTPS port 443 on io.adafruit.com.

### MQTT
Connections to port 1883 on the Pi will be tunneled to MQTTS port 8883 on io.adafruit.com.

### Security Considerations

The purpose of this service is to add an encryption layer, specifically TLS, to your adafruit IO messages in transit across the Internet. Not all IoT radio modules have a TLS stack and if you sent a message to adafruit.io with that device, it would be unencrypted at the application layer. For example, the message would be encrypted by the radio at the WiFi layer, but would be unencrypted at the Ethernet layer as it went from your router to the Internet.

The danger of unencrypted application messages are two-fold. The first is that your message may be modified in transit but more importantly, your message can be read by any server that routes your traffic. It's like sending a postcard. If you made a adafruit.io connected garage door, then a lot of people (and machines) would know when the door opened and closed.

Therefore, this service protects your data from prying eyes on the Internet.

However, this service runs as an unauthenticated service on your network. This is by design so that your IoT device can make a connection to it. But it also means that anything on your network can talk to this service. Your adafruit.io credentials are *not* stored on this gateway service, but on your IoT device. So an attacker would still need to know your adafuit.io credentials to post to adafruit.io.

Lastly, this service does not protect cellular modules. If you have something like a Adafruit FONA, then it makes an Internet connection directly through the cellular system and unless there is a TLS stack on the module, than most likely it's not end-to-end encrypted.

### Usage
Let's look at the available commands for `adafruit-io tunnel`:

```console
$ adafruit-io help tunnel

  Usage: adafruit-io tunnel [options] [command]


  Commands:

    install   installs tunnel service (linux only)
    remove    removes tunnel service (linux only)
    start     starts tunnel daemon
    restart   restarts tunnel daemon
    stop      stops tunnel daemon

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    --http <n>     http port
    --mqtt <n>     mqtt port
```

To start the tunnel daemon, you can run the following command on the default port of `8888`:
```console
$ adafruit-io tunnel start
                                     ▄▄
                                   ▄████
                                 ▄███████
                                █████████▌
                               ███████████
                              ████████████▌
             ███████████████▄ ████████████▌
              █████████████████████▀▀█████ ▄▄▄▄▄▄▄
               ▐██████████████████   █████████████████▄▄
                 ▀█████████  ▀▀███  ██████████████████████
                   █████████▄▄  ▐████▀    ▐█████████████▀
                     ▀▀███████████████▄▄█████████████▀
                      ▄███████   ██  ▀████████████▀
                     ███████▀  ▄████  ▐█████▄
                    █████████████████▄▄██████▄
                   ███████████████████████████
                  ██████████████ ▐████████████▌
                 ▐██████████▀▀    ▀███████████▌
                 █████▀▀            ▀█████████▌
                                       ▀██████
                                          ▀███
----------------------------------------------------------------------
                           adafruit io
----------------------------------------------------------------------
[status]  starting tunnel...
[status]  io.adafruit.com HTTPS tunnel running: http://localhost:8888/
[status]  io.adafruit.com MQTTS tunnel running: mqtt://localhost:1883
```

The tunnel will stay up until you shut down your computer, or stop the tunnel.
To stop the tunnel daemon, run the following command:

```console
$ adafruit-io tunnel stop
[status] stopping tunnel...
```

If you would like to run the tunnel on a different ports, you can use the `--http` & `--mqtt` options
to set the ports you wish to use. **Note**: As as a general rule processes running
without root privileges cannot bind to ports below 1024. Use a port > 1024, or run
the tunnel using elevated privileges via `sudo`, but this is not recommended.
## Client

A [node.js][9] client for use with [io.adafruit.com][6].

### Installation

```
$ npm install adafruit-io
```

### Usage

To include this module in your project, you must pass your [AIO Key][8] to the `AIO` constructor.

```js

var AIO = require('adafruit-io');

// replace xxxxxxxxxxxx with your AIO Key
aio = AIO('your_username', 'xxxxxxxxxxxx');

```

#### Feeds

Feeds are the core of the Adafruit IO system. The feed holds metadata about data that gets pushed, and you will
have one feed for each type of data you send to the system. You can have separate feeds for each
sensor in a project, or you can use one feed to contain JSON encoded data for all of your sensors.

##### Feed Creation

You have two options here, you can create a feed by passing a feed name, or you can pass an object if you would
like to define more properties.  If you would like to find information about what properties are available, please
visit the [Adafruit IO feed API docs][7].

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

##### Feed Retrieval

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
##### Feed Updating

You can update [feed properties][7] using the `aio.feeds(id).update(data, cb)` method.

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
##### Feed Deletion

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

#### Data

Data represents the data contained in feeds. You can read, add, modify, and delete data. There are also
a few convienient methods for sending data to feeds and selecting certain pieces of data.

##### Data Creation

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

##### Data Retrieval

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

##### Data Updating

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

##### Data Deletion

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

##### Helper Methods

There are a few helper methods that can make interacting with data a bit easier.

###### Send

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

###### Last

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

###### Next

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

###### Previous

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

##### Readable Stream

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

##### Writable Stream

You can use node's writable stream interface with any feed.

```js
aio.feeds('Test').write(100);
```

You can also pipe data to the stream, just like any node.js writable data.

```js
process.stdin.pipe(aio.feeds('Test'));
```

#### Groups

Groups allow you to update and retrieve multiple feeds with one request. You can add feeds
to multiple groups.

##### Group Creation

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

##### Group Retrieval

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
##### Group Updating

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

##### Group Deletion

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
Copyright (c) 2015 [Adafruit Industries](https://adafruit.com). Licensed under the [MIT license](/LICENSE?raw=true).

[Adafruit](https://adafruit.com) invests time and resources providing this open source code. Please support Adafruit and open-source hardware by purchasing products from [Adafruit](https://adafruit.com).

[1]: https://github.com/swagger-api/swagger-codegen
[2]: https://io.adafruit.com/api/docs/
[3]: https://github.com/swagger-api/swagger-codegen#build-and-run-using-docker
[4]: https://raw.githubusercontent.com/adafruit/io-swagger-templates
[5]: http://nodejs.org
[6]: https://io.adafruit.com
[7]: https://learn.adafruit.com/adafruit-io/feeds
[8]: https://learn.adafruit.com/adafruit-io/api-key
[9]: https://npmjs.com
[10]: https://learn.adafruit.com/adafruit-io/groups
