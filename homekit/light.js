'use strict';

const Hap = require('hap-nodejs'),
      Accessory = Hap.Accessory,
      Service = Hap.Service,
      Characteristic = Hap.Characteristic,
      uuid = Hap.uuid;

class Light extends Accessory {

  constructor(name, io) {

    super(name, uuid.generate(`adafruit:accessories:light-${name}`));

    this.getService(Service.AccessoryInformation)
        .setCharacteristic(Characteristic.Manufacturer, 'Adafruit Industries')
        .setCharacteristic(Characteristic.Model, 'Adafruit IO Light')
        .setCharacteristic(Characteristic.SerialNumber, 'AIOLIGHT01');

    // just call cb on ident
    this.on('identify', (paired, cb) => cb());

    this._name = name;
    this._io = io;

    this._state = {
      power: 0,
      brightness: 100,
      hue: 255,
      saturation: 100
    };

    this._stream = this._io.Groups.writable(this._name);

    let timer = setTimeout(() => {
      this._writeState();
    }, 1000);

    this._stream.on('data', (group) => {

      if(timer) {
        clearTimeout(timer);
        timer = false;
      }

      group = JSON.parse(group.toString());

      Object.keys(group.feeds).forEach((key) => {
        if(/^brightness/.test(key))
          this._state.brightness = parseInt(group.feeds[key]);
        if(/^power/.test(key))
          this._state.power = parseInt(group.feeds[key]);
        if(/^hue/.test(key))
          this._state.hue = parseInt(group.feeds[key]);
        if(/^saturation/.test(key))
          this._state.saturation = parseInt(group.feeds[key]);
      });

    });

    const service = this.addService(Service.Lightbulb, `Adafruit Light`);

    service.getCharacteristic(Characteristic.On)
           .on('set', this._lightOnSet.bind(this))
           .on('get', this._lightOnGet.bind(this));

    service.getCharacteristic(Characteristic.Brightness)
           .on('set', this._lightBrightnessSet.bind(this))
           .on('get', this._lightBrightnessGet.bind(this));

    service.getCharacteristic(Characteristic.Hue)
           .on('set', this._lightHueSet.bind(this))
           .on('get', this._lightHueGet.bind(this));

    service.getCharacteristic(Characteristic.Saturation)
           .on('set', this._lightSaturationSet.bind(this))
           .on('get', this._lightSaturationGet.bind(this));

  }

  _lightOnGet(cb) {
    cb(null, this._state.power);
  }

  _lightOnSet(value, cb) {
    this._state.power = value ? 1 : 0;
    this._writeState();
    cb();
  }

  _lightBrightnessGet(cb) {
    cb(null, this._state.brightness);
  }

  _lightBrightnessSet(value, cb) {
    this._state.brightness = parseInt(value);
    this._writeState();
    cb();
  }
  _lightSaturationGet(cb) {
    cb(null, this._state.saturation);
  }

  _lightSaturationSet(value, cb) {
    this._state.saturation = parseInt(value);
    this._writeState();
    cb();
  }

  _lightHueGet(cb) {
    cb(null, this._state.hue);
  }

  _lightHueSet(value, cb) {
    this._state.hue = parseInt(value);
    this._writeState();
    cb();
  }

  _writeState() {
    Object.keys(this._state).forEach((key) => {
      this._state[key] = this._state[key] || 0;
    });
    this._stream.write(JSON.stringify({ feeds: this._state }));
  }

}

exports = module.exports = Light;
