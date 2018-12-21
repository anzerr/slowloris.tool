
class Channel extends require('events') {

	constructor(handle, option, data, speed = 200) {
		super();
		this.handle = handle;
		this.option = option;
		this.speed = speed;
		this.data = data;
		this._socket = [];
		this._killed = false;
		this.hook();
	}

	hook() {
		this.send().then(() => {
			if (!this._killed) {
				setTimeout(() => this.hook(), 100);
			}
		});
		return this;
	}

	kill() {
		this._killed = true;
		for (let i in this._socket) {
			try {
				this._socket[i].close();
			} catch(e) {
				// try
			}
		}
	}

	send() {
		return new Promise((resolve) => {
			let done = false;
			let socket = this.handle.connect(this.option, () => {
				let i = 0;
				this.emit('connected');
				socket.write('GET / HTTP/1.1\r\n');
				this.connections += 1;
				socket.once('close', () => {
					this.emit('closed');
				});
				let a = setInterval(() => {
					if (this._killed || done || !this.data[i]) {
						clearInterval(a);
						resolve();
						return;
					}
					socket.write(this.data[i]);
					i++;
				}, this.speed);
			});
			this._socket.push(socket);
			socket.setTimeout(0);
			socket.once('close', () => {
				done = true;
			});
			socket.on('error', () => {
				done = true;
				resolve();
			});
		});
	}

}

module.exports = Channel;
