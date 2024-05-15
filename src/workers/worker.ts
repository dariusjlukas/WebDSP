import { type MathNumericType } from '../deps.ts';
import { ditfft2 } from '../dsp-functions/fft.ts';
import {
	type FromWorkerMessage,
	type ToWorkerMessage,
} from './workerRunner.ts';

declare const self: Worker;

//Event listeners
self.onmessage = (event: MessageEvent<ToWorkerMessage>) => {
	switch (event.data.message) {
		case 'do work': {
			if (!event.data.contents) {
				throw 'No work data provided';
			}
			const data = work(event.data.contents.data);
			const responseMessage: FromWorkerMessage = {
				message: 'work completed',
				queueNumber: event.data.queueNumber,
				contents: { data: data },
			};
			self.postMessage(responseMessage);
			break;
		}
		case 'exit': {
			self.postMessage({ message: 'worker exiting' });
			close();
			break;
		}
		default: {
			self.postMessage({ message: `unknown message: ${event.data}` });
			break;
		}
	}
};

self.postMessage({ message: 'ready' });

//work function
function work(data: Array<MathNumericType>) {
	return ditfft2(data);
}
