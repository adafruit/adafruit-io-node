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
  }

  get request() {

    // const request_path = request.original_fullpath.split('?')
    // canonical_request  = method + "\n"
    // canonical_request += request.original_fullpath.split('?').first
    // canonical_request += params.keys.sort.map{ |k| k + "=" + URI.escape(params[k]) }.join('&')
    // canonical_request += "\n"
    // canonical_request += 'host:' + signature[:host].strip + "\n"
    // canonical_request += 'x-aio-date:' + signature[:date].strip + "\

  }

  get version() {
    return 'aio-signature-v1';
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
    this.params = Object.keys(this.parsed.query).map(q => q.toLowerCase()).join('&');
    this.host = this.parsed.host;
    this.path = this.parsed.href.split('?')[0];

  }

  hmac(key, data) {
    const hmac = crypto.createHmac(this.algorithm(), key);
    return hmac.update(data).digest('hex');
  }

}

exports = module.exports = Signature;
