import { type Complex, type MathNumericType } from '../deps.ts';
import { add, complex, conj, multiply } from '../deps.ts';

export function correlation<T extends MathNumericType>(
	x: Array<T>,
	y: Array<T>,
): Complex {
	//Check that inputs are of the same length
	if (x.length != y.length) {
		throw 'inputs to correlation must be of the same length';
	}

	let sum = complex(0, 0);
	for (let n = 0; n < x.length; n++) {
		sum = add(sum, multiply(x[n], conj(complex(y[n])))) as Complex;
	}
	return multiply(1 / x.length, sum) as Complex;
}
