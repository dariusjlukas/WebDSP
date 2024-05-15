import {
	add,
	type Complex,
	complex,
	divide,
	exp,
	type MathNumericType,
	multiply,
	pi,
	subtract,
} from '../deps.ts';

//Cooley-Tukey recursive FFT, based on the pseudocode found
//here: https://en.m.wikipedia.org/wiki/Cooley-Tukey_FFT_algorithm
function ditfft2_rec<T extends MathNumericType>(
	x: Array<T>,
	N: number,
	s: number,
): Array<T> {
	if (N == 1) {
		return [x[0]];
	} else {
		const X = ditfft2_rec(x, N / 2, 2 * s).concat(
			ditfft2_rec(x.slice(s), N / 2, 2 * s),
		);
		for (let k = 0; k < N / 2; k++) {
			const p = complex(X[k]);
			const q = multiply(
				exp(divide(complex(0, -2 * k * pi), complex(N, 0)) as Complex),
				complex(X[k + N / 2]),
			);
			X[k] = add(p, q) as T;
			X[k + N / 2] = subtract(p, q) as T;
		}
		return X;
	}
}

export function ditfft2<T extends MathNumericType>(x: Array<T>): Array<T> {
	//Input validation
	const N = x.length; //For now, fft length = input length
	if (!Number.isInteger(Math.log2(N))) {
		throw new Error('FFT size must be a factor of 2');
	} else {
		return ditfft2_rec(x, N, 1);
	}
}
