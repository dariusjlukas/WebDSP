export function timeFn(fn: () => void, name: string, iterations: number = 1) {
	let totalDuration = 0;
	for(let i = 0; i < iterations; i++){
		const startTime = performance.now();
		fn();
		const stopTime = performance.now();
		totalDuration += stopTime - startTime;
	}
	return name + `: ${totalDuration/iterations} ms`;
}
