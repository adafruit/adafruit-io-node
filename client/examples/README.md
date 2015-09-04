# adafruit-io examples

To run these examples, you must make your [AIO Key][1] and username available to the scripts. In these examples, replace
`xxxxxxxxxx` with your AIO Key.

## Setting the AIO environment variables

To set the `AIO_USERNAME` and `AIO_KEY` environment variables on **Unix based systems**, run these from a shell:

```
export AIO_USERNAME=yourusername
```

```
export AIO_KEY=xxxxxxxxxx
```

To set the `AIO_USERNAME` and `AIO_KEY` environment variables on **Windows based systems**, run these from a command prompt:

```
set AIO_USERNAME=yourusername
```

```
set AIO_KEY=xxxxxxxxxx
```

## Running the examples

Now that you have set your AIO Key, you can run the examples. **CAUTION: These examples will make
changes to your [io.adafruit.com][2] account. Make sure you understand what they do *before* you run them.**

Here is how you would run the feed creation example (assuming your present working directory is the examples folder):

```
node feeds/create.js
```

[1]: https://learn.adafruit.com/adafruit-io/api-key
[2]: https://io.adafruit.com
