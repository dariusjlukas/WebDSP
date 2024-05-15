import * as mathjs from '../src/deps.ts';
import { timeFn } from './util.ts';
import { ditfft2 } from '../src/dsp-functions/fft.ts';

export default function runFFT() {
	const sampleRate = 128;
	const toneFreq1 = 1;
	const toneFreq2 = 15;
	const numSamples = 256;
	const testInputReal: number[] = [];
	const testInputComplex: mathjs.Complex[] = [];
	for (let i = 0; i < numSamples; i++) {
		const t1 = ((2 * mathjs.pi) / (sampleRate / toneFreq1)) * i;
		const t2 = ((2 * mathjs.pi) / (sampleRate / toneFreq2)) * i;
		testInputReal.push(mathjs.sin(t1) + mathjs.sin(t2));
		testInputComplex.push(
			mathjs.complex(
				mathjs.sin(t1) + mathjs.sin(t2),
				mathjs.sin(t1 + mathjs.pi / 2) + mathjs.sin(t2 + mathjs.pi / 2),
			),
		);
	}

	console.log(timeFn(() => ditfft2(testInputReal), 'ditfft2 (real)'));

	console.log(timeFn(() => ditfft2(testInputComplex), 'ditfft2 (complex)'));
}
