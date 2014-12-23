# adafruit-io examples

To run these examples, you must make your [AIO Key][1] available to the scripts. In these examples, replace
`xxxxxxxxxx` with your AIO Key.

## Setting the AIO_KEY environment variable

To set the `AIO_KEY` environment variable in **Unix based systems**, run this from a shell:

```
export AIO_KEY=xxxxxxxxxx
```

To set the `AIO_KEY` environment variable in **Windows based systems**, run this from a command prompt:

```
set AIO_KEY=xxxxxxxxxx

## Running the examples

Now that you have set your AIO Key, you can run the examples. **CAUTION: These examples will make
changes to your [io.adafruit.com][2] account. Make sure you understand what they do *before* you run them.**

Here is how you would run the feed creation example (assuming your present working directory is the examples folder):

```
node feeds/create.js
```

[1]: https://learn.adafruit.com/adafruit-io/api-key
[2]: https://io.adafruit.com
