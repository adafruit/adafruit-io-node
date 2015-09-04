# Adafruit IO
This is an open source API compatible version of Adafruit IO that you can run locally.

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

## Starting the Server
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

## io.adafruit.com TLS Tunnel
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

## License
Copyright (c) 2015 [Adafruit Industries](https://adafruit.com). Licensed under the [MIT license](/LICENSE?raw=true).

[Adafruit](https://adafruit.com) invests time and resources providing this open source code. Please support Adafruit and open-source hardware by purchasing products from [Adafruit](https://adafruit.com).

[1]: https://github.com/swagger-api/swagger-codegen
[2]: https://io.adafruit.com/api/docs/
[3]: https://github.com/swagger-api/swagger-codegen#build-and-run-using-docker
[4]: https://raw.githubusercontent.com/adafruit/io-swagger-templates
