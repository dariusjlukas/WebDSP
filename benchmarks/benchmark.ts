import * as mathjs from '../src/deps.ts';
import { fft } from '../src/dev_deps.ts';
import { convolution, convolutionComplex, convolutionReal } from '../src/dsp-functions/convolution.ts';
import { correlation } from '../src/dsp-functions/correlation.ts'
import { ditfft2 } from '../src/dsp-functions/fft.ts';
import * as Complex from '../src/lib/complex.ts'

//Complex numbers
{
	const r1 = Array.from({ length: 4000 }, () => Math.random() * 100)
	const r2 = Array.from({ length: 4000 }, () => Math.random() * 100)
	const c1 = Array.from(
		{ length: 4000 },
		() => { 
			return {re: Math.random() * 100, im: Math.random() * 100}
		}
	);
	const c2 = Array.from(
		{ length: 4000 },
		() => { 
			return {re: Math.random() * 100, im: Math.random() * 100}
		}
	);
	const c1Mathjs = Array.from(
		{ length: 4000 },
		() => mathjs.complex(Math.random() * 100, Math.random() * 100),
	);
	const c2Mathjs = Array.from(
		{ length: 4000 },
		() => mathjs.complex(Math.random() * 100, Math.random() * 100),
	);

	//Addition

	Deno.bench('native addition', { group: "complex addition", baseline: true }, () => {r1[0] + r2[0]})
	Deno.bench('complex mathjs addition', { group: "complex addition" }, () => {mathjs.add(c1Mathjs[0], c2Mathjs[0])})
	Deno.bench('complex addition', { group: "complex addition" }, () => {Complex.add(c1[0], c2[0])})

	Deno.bench('native addition (array)', { group: "complex addition array", baseline: true }, () => {r1.forEach((r, index) => {r + r2[index]})})
	Deno.bench('complex mathjs addition (array)', { group: "complex addition array" }, () => {c1Mathjs.forEach((c, index) => mathjs.add(c, c2Mathjs[index]))})
	Deno.bench('complex addition (array)', { group: "complex addition array" }, () => {c1.forEach((c, index) => Complex.add(c, c2[index]))})

	//Multiplication

	Deno.bench('native multiplication', { group: "complex multiplication", baseline: true }, () => {r1[0] * r2[0]})
	Deno.bench('complex mathjs multiplication', { group: "complex multiplication" }, () => {mathjs.multiply(c1Mathjs[0], c2Mathjs[0])})
	Deno.bench('complex multiplication', { group: "complex multiplication" }, () => {Complex.multiplyCplx(c1[0], c2[0])})

	Deno.bench('native multiplication (array)', { group: "complex multiplication array", baseline: true }, () => {r1.forEach((r, index) => {r * r2[index]})})
	Deno.bench('complex mathjs multiplication (array)', { group: "complex multiplication array" }, () => {c1Mathjs.forEach((c, index) => mathjs.multiply(c, c2Mathjs[index]))})
	Deno.bench('complex multiplication (array)', { group: "complex multiplication array" }, () => {c1.forEach((c, index) => Complex.multiplyCplx(c, c2[index]))})
}

//Convolution
{
	const x1 = [2, 2, 3, 4, 2, 2, 4];
	const h1 = [3, 3, 2];
	const x2 = Array.from({ length: 4000 }, () => Math.random() * 100);
	const h2 = Array.from({ length: 400 }, () => Math.random() * 100);
	const x3 = Array.from(
		{ length: 4000 },
		() => mathjs.complex(Math.random() * 100, Math.random() * 100),
	);
	const h3 = Array.from(
		{ length: 400 },
		() => mathjs.complex(Math.random() * 100, Math.random() * 100),
	);
	const x5 = Complex.fromNumberArray(x2)
	const h5 = Complex.fromNumberArray(h2)

	Deno.bench('textbook convolution', { group: "convolution"}, () => {
		convolution(x1, h1);
	});

	Deno.bench(
		`input length = ${x2.length}, coefficient length = ${h2.length} (real)`, { group: "convolution" },
		() => {
			convolutionReal(x2, h2);
		},
	);

	// Deno.bench(
	// 	`input length = ${x3.length}, coefficient length = ${h3.length} (mathjs complex)`, { group: "convolution" },
	// 	() => {
	// 		convolution(x3, h3);
	// 	},
	// );

	Deno.bench(
		`input length = ${x5.length}, coefficient length = ${h5.length} (custom complex impl)`, { group: "convolution" },
		() => {
			convolutionComplex(x5, h5);
		},
	);
};

//Correlation
{
	const x = [mathjs.complex(1, 0), mathjs.complex(0, 1), mathjs.complex(-1, 0), mathjs.complex(0, -1)]
	Deno.bench(
		`Textbook correlation`,
		() => {correlation(x, x)}
	)
}

//FFT
{
	const sampleRate = 128;
	const toneFreq1 = 1;
	const toneFreq2 = 15;
	const numSamples = 256;
	const testInput: number[] = [];
	for (let i = 0; i < numSamples; i++) {
		const t1 = ((2 * mathjs.pi) / (sampleRate / toneFreq1)) * i;
		const t2 = ((2 * mathjs.pi) / (sampleRate / toneFreq2)) * i;
		testInput.push(mathjs.sin(t1) + mathjs.sin(t2));
	}

	Deno.bench(`input length = ${testInput.length} (mathjs.fft)`, { group: "fft (real)", baseline: true }, () => {
		fft(testInput);
	});

	Deno.bench(`input length = ${testInput.length} (ditfft2)`, { group: "fft (real)" }, () => {
		ditfft2(testInput);
	});
};

{
	const sampleRate = 128;
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

	Deno.bench(`input length = ${testInput.length} (mathjs.fft)`, { group: "fft (complex)", baseline: true }, () => {
		fft(testInput);
	});

	Deno.bench(`input length = ${testInput.length} (ditfft2)`, { group: "fft (complex)" }, () => {
		ditfft2(testInput);
	});
};