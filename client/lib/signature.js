'use strict';

const crypto = require('crypto'),
      url = require('url');

class Signature {

  constructor(options) {

    this.username = false;
    this.key = false;
    this.host = false;
    this.method = 'GET';
    this.params = false;
    this.path = false;
    this.parsed = false;

    Object.assign(this, options || {});

    if(! this.username)
      throw new Error('Username is required');

    if(! this.key)
      throw new Error('AIO Key is required');

    if(! this.path)
      throw new Error('path is required');

  }

  toString() {

    const step1 = this.hmac(this.key, this.date()),
          step2 = this.hmac(step1, this.host),
          step3 = this.hmac(step2, this.method),
          step4 = this.hmac(step3, this.params);

    const signing_key = this.hmac(step4, this.version),
          canonical_request = this.hash(this.request),
          to_sign = `${this.algorithm}\n${this.date}\n${canonical_request}`;

    return this.hmac(signing_key, to_sign);

  }

  get request() {

    return `${this.method}\n${this.path}?${this.params}
            host: ${this.host}
            x-aio-date: ${this.date}`;

  }

  get version() {
    return 'aio-signature-v1';
  }

  get credential() {
    return `${this.username}/${this.version}`;
  }

  get date() {
    return (new Date()).toISOString();
  }

  get algorithm() {
    return 'sha512';
  }

  get algorithmName() {
    return `aio-hmac-${this.algorithm()}`;
  }

  get path() {
    return this.path;
  }

  set path(path) {

    this.parsed = url.parse(path, true);
    this.params = Object.keys(this.parsed.query).sort().map(q => q.toLowerCase()).join('&');
    this.host = this.parsed.host;
    this.path = this.parsed.href.split('?')[0];

  }

  hash(data) {
    const hash = crypto.createHash(this.algorithm());
    return hmac.update(data).digest('hex');
  }

  hmac(key, data) {
    const hmac = crypto.createHmac(this.algorithm(), key);
    return hmac.update(data).digest('hex');
  }

}

exports = module.exports = Signature;
