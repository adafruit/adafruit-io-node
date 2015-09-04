# Node.js Adafruit IO Server
This is an open source API compatible version of Adafruit IO that you can run locally.

## Installation

Make sure you have the latest stable version of [Node.js][3] installed on your computer.

```console
$ node -v
v0.12.6
```
Install `forever` and `adafruit-io` on your computer using `npm`.

```console
$ npm install -g forever adafruit-io-server
```

You can also optionally install `forever-service` if you are using a Linux distro, and would like to run the server as a service.

```console
$ npm install -g forever-service
```

## Starting the Server
First, let's look at the commands available for `adafruit-io`:

```console
$ adafruit-io help

  Usage: adafruit-io [options] [command]


  Commands:

    service [cmd]  start or stop Adafruit IO service (linux only)
    server [cmd]   start or stop the Adafruit IO server
    help [cmd]     display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

The three main commands available are `service`, `server`, and `help`.
Let's look at the available commands for `adafruit-io server`:

```console
$ adafruit-io help server

  Usage: adafruit-io server [options] [command]


  Commands:

    start     starts the server
    restart   restarts the server
    stop      stops the server

  Options:

    -h, --help      output usage information
    -V, --version   output the version number
    -p, --port <n>  http port
```

To start the server, you can run the following command on the default port of `8080`:
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
                                             ▀
----------------------------------------------------------------------
                           adafruit io
----------------------------------------------------------------------
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

## Contributing
This server was generated using [Swagger Codegen][1], by running the [Adafruit IO REST documentation][2] through
the [Adafruit IO Swagger templates][4]. If you would like to contribute to this project, please submit pull requests
with your modifications to the [Adafruit IO template repository][4].

## License
Copyright (c) 2015 Adafruit Industries. Licensed under the MIT license.

Adafruit invests time and resources providing this open source code. Please support Adafruit and open-source hardware by purchasing products from [Adafruit](https://adafruit.com).

[1]: https://github.com/swagger-api/swagger-codegen
[2]: https://io.adafruit.com/api/docs/
[3]: https://github.com/swagger-api/swagger-codegen#build-and-run-using-docker
[4]: https://raw.githubusercontent.com/adafruit/io-swagger-templates
