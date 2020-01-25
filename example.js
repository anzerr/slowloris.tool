
const Loris = require('./index.js'),
	{Server} = require('http.server');

let port = 1000 + Math.floor(Math.random() * 6800);

let s = new Server(port), l = null;
s.create((req, res) => {
	process.stdout.write('*');
	res.status(200).send(':)');
}).then((server) => {
	console.log('started server on', port);

	let open = 0;
	const log = setInterval(() => {
		console.log('\nconnections', open);
	}, 1000);

	server.on('connection', (socket) => {
		process.stdout.write('.');
		open += 1;
		socket.once('close', () => {
			open += -1;
		});
	});
	server.on('clientError', (err) => {
		console.log(err);
	});
	server.on('error', (err) => {
		console.log(err);
	});

	setTimeout(() => {
		console.log('stop');
		l.stop();
		s.close();
		clearInterval(log);
	}, 1000 * 10);
	l = new Loris('http://localhost:' + port, 100000).attack();
	console.log('attack');
	return new Promise((resolve) => l.once('end', resolve));
}).then(() => {
	console.log('attack ended');
	process.exit(0);
}).catch(console.log);

