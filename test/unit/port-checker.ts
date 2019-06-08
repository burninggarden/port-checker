import Tap         from 'tap';
import Net         from 'net';
import PortChecker from 'port-checker';

Tap.test('Correctly indicates when a port is in use', test => {
	const port = 7624;
	const portChecker = new PortChecker(port);

	const server = Net.createServer(socket => {
		socket.write('This port is in use\r\n');
		socket.end();
	});

	server.listen(port);

	server.on('listening', () => {
		portChecker.isPortInUse().then(result => {
			test.ok(result);
			server.close(test.end);
		});
	});
});

Tap.test('Correctly indicates when a port is not in use', test => {
	const usedPort = 7625;
	const unusedPort = 7626;
	const portChecker = new PortChecker(unusedPort);

	const server = Net.createServer(socket => {
		socket.write('This port is in use\r\n');
		socket.end();
	});

	server.listen(usedPort);

	server.on('listening', () => {
		portChecker.isPortInUse().then(result => {
			test.notOk(result);
			server.close(test.end);
		});
	});
});
