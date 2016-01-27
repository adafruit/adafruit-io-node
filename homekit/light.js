'use strict';

const Hap = require('hap-nodejs'),
      Accessory = Hap.Accessory,
      Service = Hap.Service,
      Characteristic = Hap.Characteristic;
      uuid = Hap.uuid;

class Light extends Accessory {

  constructor(name, io) {

    super(name, uuid.generate('adafruit:accessories:light'));

    this.getService(Service.AccessoryInformation)
        .setCharacteristic(Characteristic.Manufacturer, 'Adafruit Industries')
        .setCharacteristic(Characteristic.Model, 'Adafruit IO Light')
        .setCharacteristic(Characteristic.SerialNumber, 'AIOLIGHT01');

    this.name = name;
    this._io = io;

    this._state = {
      power: false,
      brightness: 100
    };

    this._stream = this._io.groups.writable(this.name);

    this._stream.on('data', (group) => {
      group = JSON.parse(group);
      this._state = group.feeds;
    });

    // just call cb on ident
    this.on('identify', (paired, cb) => cb(); );

    this.addService(Service.Lightbulb, 'Lightbulb')
        .getCharacteristic(Characteristic.On)
        .on('set', this._lightOnSet.bind(this))
        .on('get', this._lightOnGet.bind(this));

    this.addService(Service.Lightbulb, 'Lightbulb')
        .getCharacteristic(Characteristic.Brightness)
        .on('set', this._lightBrightnessSet.bind(this))
        .on('get', this._lightBrightnessGet.bind(this));

  }

  _lightOnGet(cb) {
    cb(null, this._state.power);
  }

  _lightOnSet(value, cb) {
    this._state.power = value;
    this._stream.write(JSON.stringify({ feeds: this._state }));
    cb();
  }

  _lightBrightnessGet(cb) {
    cb(null, this._state.brightness);
  }

  _lightBrightnessSet(value, cb) {
    this._state.brightness = parseInt(value);
    this._stream.write(JSON.stringify({ feeds: this._state }));
    cb();
  }

}
