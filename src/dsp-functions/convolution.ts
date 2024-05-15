import {
	add,
	type MathNumericType,
	type Matrix,
	multiply,
	size,
	zeros,
} from '../deps.ts';

import * as Complex from '../lib/complex.ts'

//Compute the convolution of input x with model coefficient vector (impulse response) h
export function convolutionMatrix<T extends MathNumericType>(
	x: Array<T>,
	h: Array<T>,
): Array<T> {
	//generate toeplitz matrix H of size {x.length} by {x.length}
	const H = zeros(x.length, x.length) as Matrix;
	for (let row = 0; row < (size(H) as Matrix).get([0]); row++) {
		for (let k = row, i = 0; k >= 0 && i < h.length; k--, i++) {
			H.set([row, k], h[i]);
		}
	}

	//Y = H * X
	return multiply(H, x).toArray() as Array<T>;
}

const shiftArrayRight = <T>(a: Array<T>) => {
	for(let i = a.length-1; i > 0; i--){
		a[i] = a[i-1];
	}
}

export function convolution<T extends MathNumericType>(
	x: Array<T>,
	h: Array<T>,
): Array<T> {
	const delayLine = Array<T>(h.length).fill(0 as T);
	const y = Array<T>(x.length).fill(0 as T);
	for (let k = 0; k < x.length; k++) {
		shiftArrayRight(delayLine);
		delayLine[0] = x[k];
		for (let i = 0; i < h.length; i++) {
			y[k] = add(y[k], multiply(delayLine[i], h[i])) as T;
		}
	}
	return y;
}

export function convolutionComplex(
	x: Array<Complex.Complex>,
	h: Array<Complex.Complex>,
): Array<Complex.Complex> {
	const delayLine = Array<Complex.Complex>(h.length).fill({re: 0, im: 0});
	const y = Array<Complex.Complex>(x.length).fill({re: 0, im: 0});
	for (let k = 0; k < x.length; k++) {
		shiftArrayRight(delayLine);
		delayLine[0] = x[k];
		for (let i = 0; i < h.length; i++) {
			y[k] = Complex.add(y[k], Complex.multiplyCplx(delayLine[i], h[i]));
		}
	}
	return y;
}

export function convolutionReal(
	x: Array<number>,
	h: Array<number>,
): Array<number> {
	const delayLine = Array<number>(h.length).fill(0);
	const y = Array<number>(x.length).fill(0);
	for (let k = 0; k < x.length; k++) {
		shiftArrayRight(delayLine);
		delayLine[0] = x[k];
		for (let i = 0; i < h.length; i++) {
			y[k] = y[k] + delayLine[i] * h[i];
		}
	}
	return y;
}