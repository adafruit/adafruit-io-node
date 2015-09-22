# Adafruit IO
A Node.js Adafruit IO Client, Local Server, & io.adafruit.com TLS Tunnel.

## Installation
Make sure you have the latest stable version of [Node.js][3] installed on your computer.

```console
$ node -v
v4.0.0
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
  * [Usage](#usage)
* [TLS Tunnel](#tls-tunnel)
  * [Security Considerations](#security-considerations)
  * [Usage](#usage-1)
* [Client](#client)
  * [Usage](#usage-2)
    * [Authentication](#authentication)
    * [Feeds](#feeds)
    * [Data](#data)
    * [Groups](#groups)

## Help
View the available sub commands for `adafruit-io`:

```console
$ adafruit-io help
Usage: adafruit-io <command>

Commands:
  server      Adafruit IO local server
  client      Adafruit IO client
  tunnel      TLS tunnel to io.adafruit.com
  help        Show help
  version     Show version info
  completion  generate bash completion script
```

The three main commands available are `service`, `tunnel`, and `help`.

## Server
The server included in this package is an open source API compatible version of
Adafruit IO that you can run locally. Future additions to io.adafruit.com will
allow you to sync your local data with the hosted service.

### Usage
The tunnel commands will always be prefixed with `adafruit-io server`, and you can always get more information
about the available commands by running `adafruit-io server help`.

#### Configuration

First, you will need to configure the server with a `username` and `key` that
you will expect when clients make requests to the server. Let's look at the help
for `adafruit-io server config help`.

```console
$ adafruit-io server config help
Usage: adafruit-io server config [options]

Commands:
  help  Show help

Options:
  -p, --port      Server port                    [default: "8080"]
  -u, --username  Local Adafruit IO Username            [required]
  -k, --key       Local Adafruit IO Key                 [required]
```

The `--username` and `--key` you set here will be used by the server to authenticate requests from
your devices. You can set them to any value, but make sure the Adafruit IO Key is not easily
guessable.

```console
$ adafruit-io server config --username test_user --key efoih3r8hsfdfh1r31rhsdhf
[info] Server settings saved
```
To start the server daemon, you can run the following command on the default port of `8080`
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
[info] server ready at http://todd.local:8080/
[info] documentation is available at http://todd.local:8080/api/docs
```
The server will stay up until you shut down your computer, or stop the server.
To stop the server, run the following command:

```console
$ adafruit-io server stop
[info] stopping server...
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
The tunnel commands will always be prefixed with `adafruit-io tunnel`, and you can always get more information
about the available commands by running `adafruit-io tunnel help`.

```console
$ adafruit-io tunnel help
Usage: adafruit-io tunnel <command> [options]

Commands:
  install  Install tunnel service (linux only)
  remove   Remove tunnel service (linux only)
  start    Start tunnel daemon
  restart  Restart tunnel daemon
  stop     Stop tunnel daemon
  help     Show help

Options:
  -h, --http  HTTP port             [default: "8888"]
  -m, --mqtt  MQTT port             [default: "1883"]
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
[info] io.adafruit.com HTTPS tunnel running: http://todd.local:8888/
[info] io.adafruit.com MQTTS tunnel running: mqtt://todd.local:1883
```

The tunnel will stay up until you shut down your computer, or stop the tunnel.
To stop the tunnel daemon, run the following command:

```console
$ adafruit-io tunnel stop
[info] stopping tunnel...
```

If you would like to run the tunnel on a different ports, you can use the `--http` & `--mqtt` options
to set the ports you wish to use. **Note**: As as a general rule processes running
without root privileges cannot bind to ports below 1024. Use a port > 1024, or run
the tunnel using elevated privileges via `sudo`, but this is not recommended.

## Client

A CLI client for use with [io.adafruit.com][6] or the local Adafruit IO server included in this package.

### Usage

The client commands will always be prefixed with `adafruit-io client`, and you can append `help` to any
command to get more info about that command.

#### Authentication
```console
$ adafruit-io client config help
Usage: adafruit-io client config [options]

Commands:
  help  Show help

Options:
  -h, --host      Server hostname                   [default: "io.adafruit.com"]
  -p, --port      Server port                                    [default: "80"]
  -u, --username  Adafruit IO Username                                [required]
  -k, --key       Adafruit IO Key                                     [required]

```

You can then use your Adafruit IO `username` and `key` to authenticate yourself.

```console
$ adafruit-io client config --username testing_username --key xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
[info] Client settings saved
```

#### Feeds

Feeds are the core of the Adafruit IO system. The feed holds metadata about data that gets pushed, and you will
have one feed for each type of data you send to the system. You can have separate feeds for each
sensor in a project, or you can use one feed to contain JSON encoded data for all of your sensors.

```console
$ adafruit-io client feeds help
Usage: adafruit-io client feeds <action>

Actions:
  all      All feeds for current user
  create   Create a new Feed
  destroy  Delete an existing Feed
  get      Get feed by ID, Feed key, or Feed Name
  update   Update properties of an existing Feed
  replace  Replace an existing Feed
  watch    Listen for new values
  help     Show help
```

**Example:** List all feeds for your user
```console
$ adafruit-io client feeds all
[info] Success
[ { id: 1000,
    key: 'frontdoor',
    name: 'frontdoor',
    description: '',
    unit_type: null,
    unit_symbol: null,
    last_value: 'open',
    status: 'offline',
    visibility: 'private',
    enabled: true,
    license: null,
    group_id: null,
    created_at: '2015-08-28T17:13:12.516Z',
    updated_at: '2015-09-21T17:20:04.630Z' } ]
```

Some commands will expect paramaters, so you can also view help on each command. Let's
take a look at the parameters expected by `update`.

```console
$ adafruit-io client feeds update help
Usage: adafruit-io client feeds update <id> [options]

Parameters:
  id    ID, key, or name of feed to use
  help  Show help

Options:
  -j, --json  JSON output
```

**Example:** Update `frontdoor` feed name to be `Front`

```console
$ adafruit-io client feeds update frontdoor
? feed.name (optional): Front
? feed.key (optional):
? feed.description (optional):
? feed.unit_type (optional):
? feed.unit_symbol (optional):
? feed.visibility (optional):
? feed.license (optional):
? feed.group_id (optional):
[info] Success
{ id: 1000,
  key: 'frontdoor',
  name: 'Front',
  description: '',
  unit_type: '',
  unit_symbol: '',
  last_value: 'open',
  status: 'offline',
  visibility: 'private',
  enabled: true,
  license: null,
  group_id: null,
  created_at: '2015-08-28T17:13:12.516Z',
  updated_at: '2015-09-21T21:12:37.958Z' }
```

You can also listen for realtime changes to your feeds by using the `watch` command.

**Example:** Listen for changes to the `frontdoor` feed
```console
$ adafruit-io client feeds watch door
[info] Feeds -> Front
{ id: 1000,
  key: 'frontdoor',
  name: 'Front',
  description: '',
  unit_type: '',
  unit_symbol: '',
  last_value: 'closed',
  status: 'offline',
  visibility: 'private',
  user_id: 5,
  created_at: '2015-08-28T17:13:12.516Z',
  updated_at: '2015-09-21T21:12:37.958Z',
  mode: null,
  enabled: true,
  fixed: false,
  last_value_at: '2015-09-21T15:10:34.048Z',
  license: null,
  group_id: null,
  feed_alias: null,
  recorded: 'just now',
  last_geo: { lat: null, lon: null, ele: null }
}
```

All operations can also output raw JSON so they can be piped to tools like [jq](https://stedolan.github.io/jq/)
for processing incoming data.

**Example:** Get all feeds as JSON, and pipe the output to [jq](https://stedolan.github.io/jq/)
to extract the feed names.
```console
$ adafruit-io client feeds all --json | jq '.[] | .name' --raw-output
Front
temperature
battery
fan
door
```

**Example:** Watch the `door` feed for changes, output new values as JSON,
and pipe the output to [jq](https://stedolan.github.io/jq/).
```console
$ adafruit-io client feeds watch door --json | jq .last_value --raw-output
open
closed
open
```

#### Data

Data represents the actual stored data sent to Adafruit IO feeds.

```console
$ adafruit-io client data help
Usage: adafruit-io client data <action>

Actions:
  all       All data for current feed
  create    Create new Data
  send      Create new Data and Feed
  receive   Receive data?
  previous  Previous Data in Queue
  next      Next Data in Queue
  last      Last Data in Queue
  destroy   Delete existing Data
  get       Returns data based on ID
  update    Update properties of existing Data
  replace   Replace existing Data
  watch     Listen for new values
  help      Show help
```

Let's look at the `all` operation as an example.

```console
$ adafruit-io client data all help
Usage: adafruit-io client data all <feed_id>

Parameters:
  feed_id  ID, key, or name of feed
  help     Show help
```

**Example:** View all feed data

```console
$ adafruit-io client data all door
[info] Success
[ { id: 122222,
    value: 'open',
    position: null,
    feed_id: 1000,
    group_id: null,
    expiration: null,
    lat: null,
    lon: null,
    ele: null,
    completed_at: null,
    created_at: '2015-09-21T15:10:34.048Z',
    updated_at: '2015-09-21T15:10:34.048Z',
    created_epoch: 1442848234.04861 } ]
```

#### Groups

Groups allow you to update and retrieve multiple feeds with one request.

```console
$ adafruit-io client groups help
Usage: adafruit-io client groups <action>

Actions:
  all      All groups for current user
  create   Create a new Group
  destroy  Delete an existing Group
  get      Returns Group based on ID
  update   Update properties of an existing Group
  replace  Replace an existing Group
  watch    Listen for new values
  help     Show help
```
**Example:** List all groups for your user
```console
$ adafruit-io client groups all
[info] Success
[ { id: 5,
    name: 'weather',
    key: 'weather',
    description: null,
    source: null,
    properties: null,
    source_keys: null,
    created_at: '2015-07-14T22:41:48.898Z',
    updated_at: '2015-07-14T22:41:48.898Z',
    feeds: [ [Object], [Object] ] } ]
```

**Example:** Get the `weather` group as JSON and parse the feed names with [jq](https://stedolan.github.io/jq/)

```console
$ adafruit-io client groups get weather --json | jq '.feeds[] | .name' --raw-output
humidity
temp
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
