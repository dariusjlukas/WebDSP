import { assertEquals } from '../src/dev_deps.ts';
import * as mathjs from '../src/deps.ts';
import { fft } from '../src/dev_deps.ts';
import { assertThrows } from 'https://deno.land/std@0.217.0/assert/assert_throws.ts';

//dsp-function imports
import { convolution, convolutionMatrix, convolutionComplex } from '../src/dsp-functions/convolution.ts';
import { correlation } from '../src/dsp-functions/correlation.ts'
import { ditfft2 } from '../src/dsp-functions/fft.ts';
import { complex } from '../src/deps.ts';
import * as Complex from '../src/lib/complex.ts';

//Convolution
Deno.test('textbook convolution', () => {
	const x = [2, 2, 3, 4, 2, 2, 4];
	const h = [3, 3, 2];
	assertEquals(convolution(x, h), [6, 12, 19, 25, 24, 20, 22]);
	assertEquals(convolutionMatrix(x, h), [6, 12, 19, 25, 24, 20, 22]);
	assertEquals(convolutionComplex(Complex.fromNumberArray(x), Complex.fromNumberArray(h)), Complex.fromNumberArray([6, 12, 19, 25, 24, 20, 22]));
});

//Correlation
Deno.test('textbook correlation', () => {
	const x = [complex(1, 0), complex(0, 1), complex(-1, 0), complex(0, -1)]
	assertEquals(correlation(x, x), complex(1, 0))
})

Deno.test('correlation input checking', () => {
	const x = [1, 2, 3]
	const y = [1, 2, 3, 4]
	assertThrows( () => correlation(x,y), 'inputs to correlation must be of the same length')
})

//fft
Deno.test('complex fft', () => {
	const sampleRate = 64;
	const toneFreq1 = 1;
	const toneFreq2 = 15;
	const numSamples = 256;
	const testInput: mathjs.Complex[] = [];
	for (let i = 0; i < numSamples; i++) {
		const t1 = ((2 * mathjs.pi) / (sampleRate / toneFreq1)) * i;
		const t2 = ((2 * mathjs.pi) / (sampleRate / toneFreq2)) * i;
		testInput.push(
			mathjs.complex(
				mathjs.sin(t1) + mathjs.sin(t2),
				mathjs.sin(t1 + mathjs.pi / 2) + mathjs.sin(t2 + mathjs.pi / 2),
			),
		);
	}
	const frequencyDomain = ditfft2(testInput);

	const refFrequencyDomain = fft(testInput);

	assertEquals(frequencyDomain, refFrequencyDomain);
});

Deno.test('real fft', () => {
	const sampleRate = 128;
	const toneFreq1 = 1;
	const toneFreq2 = 15;
	const numSamples = 256;
	const testInput = [];
	for (let i = 0; i < numSamples; i++) {
		const t1 = ((2 * mathjs.pi) / (sampleRate / toneFreq1)) * i;
		const t2 = ((2 * mathjs.pi) / (sampleRate / toneFreq2)) * i;
		testInput.push(mathjs.sin(t1) + mathjs.sin(t2));
	}
	const frequencyDomain = ditfft2(testInput);

	const refFrequencyDomain = fft(testInput);

	assertEquals(frequencyDomain, refFrequencyDomain);
});

Deno.test('fft input validation', () => {
	assertThrows( () => ditfft2([1, 2, 3, 4, 5]), 'FFT size must be a factor of 2')
})