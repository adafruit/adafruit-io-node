var net = require('net'),
    tls = require('tls'),
    fs  = require('fs');

exports = module.exports = function(options) {

  options.secureProtocol =  'TLSv1_2_method';
  options.rejectUnauthorized = true;
  options.ciphers = [
    'ecdhe-rsa-aes256-gcm-sha384',
    'ecdhe-rsa-aes128-gcm-sha256'
  ].join(':');

  var client = tls.connect(options);

  var server = net.createServer(function(socket) {
    client.pipe(socket).pipe(client);
  });

  client.on('error', server.emit.bind(server, 'error'));

  return server;

};

