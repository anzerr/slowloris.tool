
const Loris = require('./index.js'),
	{Server} = require('http.server');

let port = 1000 + Math.floor(Math.random() * 6800);

let s = new Server(port);
s.create((req, res) => {
	process.stdout.write('*');
	res.status(200).send(':)');
}).then((server) => {
	console.log('started server on', port);

	let open = 0;
	setInterval(() => {
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

	let l = new Loris('http://localhost:' + port, 100000).attack();
	return new Promise((resolve) => l.once('end', resolve));
}).then(() => {
	console.log('attack ended');
}).catch(console.log);

