import Net            from 'net';
import PromiseWrapper from '@burninggarden/promise-wrapper';
import {SystemError}  from '@burninggarden/enums';

interface SocketError extends Error {
	code: string;
}

class PortChecker {

	private port : number;

	public constructor(port: number) {
		this.port = port;
	}

	public isPortInUse(): Promise<boolean> {
		const promiseWrapper = new PromiseWrapper<boolean>();

		const ephemeralServer = Net.createServer(socket => {
			socket.write('Socket was in use\r\n');
			socket.end();
		});

		ephemeralServer.listen(this.getPort());

		ephemeralServer.on('error', (error: SocketError) => {
			if (error.code === SystemError.EADDRINUSE) {
				promiseWrapper.resolve(true);
			} else {
				throw error;
			}
		});

		ephemeralServer.on('listening', () => {
			ephemeralServer.close();
			promiseWrapper.resolve(false);
		});

		return promiseWrapper.getPromise();
	}

	private getPort(): number {
		return this.port;
	}

}

export default PortChecker;
