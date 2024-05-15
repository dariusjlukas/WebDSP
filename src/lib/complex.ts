export interface Complex {
    re: number,
    im: number
}

export function fromNumberArray(a: Array<number>){
    const cplxArray = Array<Complex>(a.length)
    a.forEach((n, index) => {
        cplxArray[index] = {re: n, im: 0}
    })
    return cplxArray
}

export function conj(c: Complex): Complex{
    return {re: c.re, im: -c.im}
}


//TODO(@dariusjlukas): try this with re*re and im*im instead of Math.pow
export function calcModulus(c: Complex) {
    return Math.sqrt(Math.pow(c.re, 2) + Math.pow(c.im, 2))
}

export function calcArgument(c: Complex) {
    if(c.re > 0 || c.im != 0){
        return 2*Math.atan(c.im/(c.re+Math.sqrt(Math.pow(c.re, 2) + Math.pow(c.im, 2))))
    }
    else if(c.re < 0 && c.im == 0){
        return Math.PI
    }
    else if(c.re == 0 && c.im == 0){
        //Technically this should be undefined, however that tends to have a different meaning in javascript
        return NaN
    }
}

export function calcReciprocal(c: Complex): Complex {
    const denominator = Math.pow(c.re, 2) + Math.pow(c.im, 2)
    return {re: c.re/(denominator), im: -c.im/(denominator)}
}

export function add(lAddend: Complex, rAddend: Complex): Complex{
    return {re: lAddend.re + rAddend.re, im: lAddend.im + rAddend.im}
}

export function subtract(minuend: Complex, subtrahend: Complex): Complex{
    return {re: minuend.re - subtrahend.re, im: minuend.im - subtrahend.im}
}

export function multiplyReal(multiplicand: Complex, multiplier: number): Complex{
    return {re: multiplicand.re * multiplier, im: multiplicand.im * multiplier}
}

export function multiplyCplx(multiplicand: Complex, multiplier: Complex): Complex{
    return {re: multiplicand.re * multiplier.re - multiplicand.im * multiplier.im, im: multiplicand.re * multiplier.im + multiplicand.im * multiplier.re}
}

export function divideReal(dividend: Complex, divisor: number): Complex{
    return {re: dividend.re / divisor, im: dividend.im / divisor}
}

export function divideCplx(dividend: Complex, divisor: Complex): Complex{
    const denominator = Math.pow(divisor.re, 2) + Math.pow(divisor.im, 2)
    return {re: (dividend.re*divisor.re + dividend.im*divisor.im)/denominator,
    im: (dividend.im*divisor.re - dividend.re*divisor.im)/denominator}
}