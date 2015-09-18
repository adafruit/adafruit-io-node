#!/usr/bin/env node

var spawn = require('child_process').spawn,
    fs = require('fs'),
    path = require('path'),
    logo = fs.readFileSync(path.join(__dirname,'logo.txt'), 'utf8'),
    tunnel = require('commander'),
    hostname = require('os').hostname(),
    chalk = require('chalk'),
    package = require('./package.json');

var forever = process.platform === 'win32' ? 'forever.cmd' : 'forever';
tunnel._name = 'adafruit-io tunnel';

function install() {

  if(require('os').platform() !== 'linux')
    return console.error('[error]   running the tunnel as a service is only supported on linux');

  process.env.TUNNEL_HTTP = tunnel.http || 8888;
  process.env.TUNNEL_MQTT = tunnel.mqtt || 1883;

  process.stdout.write(logo);
  console.log(chalk.bold('[status]') + '  starting service...');

  var child = spawn('forever-service', ['install', '-s', 'index.js', '--start', 'aiotunnel'], {
    cwd: path.join(__dirname, 'tunnel'),
    env: process.env,
    detached: true
  });

  console.log(chalk.bold('[status]') + `  io.adafruit.com HTTPS tunnel running: http://${hostname}:${process.env.TUNNEL_HTTP}/`);
  console.log(chalk.bold('[status]') + `  io.adafruit.com MQTTS tunnel running: mqtt://${hostname}:${process.env.TUNNEL_MQTT}\n`);

  child.on('error', console.log);
  child.on('exit', function(code) {
    process.exit(code);
  });
}

function remove() {

  if(require('os').platform() !== 'linux')
    return console.error('[error]   running the tunnel as a service is only supported on linux');

  var child = spawn('forever-service', ['delete', 'aiotunnel'], {
    cwd: path.join(__dirname, 'tunnel'),
    env: process.env,
    detached: true
  });

  console.log(chalk.bold('[status]') + ' stopping tunnel...\n');

  child.on('error', console.log);
  child.on('exit', function(code) {
    process.exit(code);
  });
}

function start() {

  process.env.TUNNEL_HTTP = tunnel.http || 8888;
  process.env.TUNNEL_MQTT = tunnel.mqtt || 1883;

  process.stdout.write(logo);
  console.log(chalk.bold('[status]') + '  starting tunnel...');

  var child = spawn(forever, ['start', '-s', 'index.js'], {
    cwd: path.join(__dirname, 'tunnel'),
    env: process.env,
    detached: true
  });

  console.log(chalk.bold('[status]') + `  io.adafruit.com HTTPS tunnel running: http://${hostname}:${process.env.TUNNEL_HTTP}/`);
  console.log(chalk.bold('[status]') + `  io.adafruit.com MQTTS tunnel running: mqtt://${hostname}:${process.env.TUNNEL_MQTT}\n`);

  child.on('error', console.log);
  child.on('exit', function(code) {
    process.exit(code);
  });
}

function restart() {

  var child = spawn(forever, ['restart', 'index.js'], {
    cwd: path.join(__dirname, 'tunnel'),
    env: process.env,
    detached: true
  });

  console.log(chalk.bold('[status]') + ' restarting tunnel...\n');

  child.on('error', console.log);
  child.on('exit', function(code) {
    process.exit(code);
  });
}

function stop() {

  var child = spawn(forever, ['stop', 'index.js'], {
    cwd: path.join(__dirname, 'tunnel'),
    env: process.env,
    detached: true
  });

  console.log(chalk.bold('[status]') + ' stopping tunnel...\n');

  child.on('error', console.log);
  child.on('exit', function(code) {
    process.exit(code);
  });
}

tunnel.version(package.version);
tunnel.option('--http <n>', 'http port', parseInt);
tunnel.option('--mqtt <n>', 'mqtt port', parseInt);
tunnel.command('install').description('installs tunnel service (linux only)').action(install);
tunnel.command('remove').description('removes tunnel service (linux only)').action(remove);
tunnel.command('start').description('starts tunnel daemon').action(start);
tunnel.command('restart').description('restarts tunnel daemon').action(restart);
tunnel.command('stop').description('stops tunnel daemon').action(stop);
tunnel.parse(process.argv);

if (!process.argv.slice(2).length)
  tunnel.outputHelp();

