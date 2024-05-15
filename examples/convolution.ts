import * as mathjs from '../src/deps.ts';
import { timeFn } from './util.ts';
import { convolution, convolutionReal } from '../src/dsp-functions/convolution.ts';

export default function runConvolution() {
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

	console.log(timeFn(() => convolution(x1, h1), 'small convolution', 100));

	console.log(timeFn(() => convolutionReal(x2, h2), 'real convolution', 100));

	console.log(timeFn(() => convolution(x3, h3), 'complex convolution', 100));
}
