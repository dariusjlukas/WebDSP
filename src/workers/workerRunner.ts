import { MathNumericType } from '../deps.ts';
import { type Complex, complex, pi, sin } from '../deps.ts';

interface WorkContents {
	data: MathNumericType[];
}

export interface ToWorkerMessage {
	message: string;
	queueNumber?: number;
	contents?: WorkContents;
}

export interface FromWorkerMessage {
	message: string;
	queueNumber?: number;
	contents?: WorkContents;
}

interface WorkItem {
	status: 'available' | 'in progress' | 'done';
	contents: WorkContents;
}

interface WorkQueue {
	queueCounter: number;
	items: Array<WorkItem>;
}

//Returns the next available work item's contents and marks it as in progress, or returns null if the queue is empty
function takeFromQueue(
	workQueue: WorkQueue,
): { queueNumber: number; contents: WorkContents } | null {
	if (workQueue.queueCounter < workQueue.items.length) {
		workQueue.items[workQueue.queueCounter].status = 'in progress';
		const queueItem = {
			queueNumber: workQueue.queueCounter,
			contents: workQueue.items[workQueue.queueCounter].contents,
		};
		workQueue.queueCounter++;
		return queueItem;
	}
	return null;
}

//Mark an item in the work queue as complete
function markItemComplete(workQueue: WorkQueue, queueNumber: number): boolean {
	if (workQueue.items[queueNumber].status == 'in progress') {
		workQueue.items[queueNumber].status = 'done';
		return true;
	}
	return false;
}

function createTestData(
	sampleRate: number,
	numSamples: number,
	toneFreq1: number,
	toneFreq2: number,
): Complex[] {
	const testData: Complex[] = Array(numSamples);
	for (let i = 0; i < numSamples; i++) {
		const t1 = ((2 * pi) / (sampleRate / toneFreq1)) * i;
		const t2 = ((2 * pi) / (sampleRate / toneFreq2)) * i;
		testData[i] = complex(
			sin(t1) + sin(t2),
			sin(t1 + pi / 2) + sin(t2 + pi / 2),
		);
	}

	return testData;
}

export default function main() {
	const sampleRate = 64;
	const toneFreq1 = 16;
	const toneFreq2 = 2;
	const numSamples = 16384;

	//Create worker pool and work queue
	const numWorkers = 16;
	const workSize = 100;
	const workQueue: WorkQueue = {
		queueCounter: 0,
		items: new Array(workSize).fill({}).map(() => ({
			status: 'available',
			contents: {
				data: createTestData(
					sampleRate,
					numSamples,
					toneFreq1,
					toneFreq2,
				),
			},
		})),
	};

	//Assign work to workers
	for (let i = 0; i < numWorkers; i++) {
		const worker = new Worker(import.meta.resolve('./worker.ts'), {
			type: 'module',
		});

		worker.onmessage = (event: MessageEvent<FromWorkerMessage>) => {
			// console.log(`from worker #${i}: ${JSON.stringify(event.data)}`)
			switch (event.data.message) {
				case 'ready': {
					console.log(`worker #${i} is ready`);
					const firstWorkItem = takeFromQueue(workQueue); //This worker's first work item
					if (firstWorkItem != null) {
						console.log(
							`assigning work item #${firstWorkItem.queueNumber} to worker #${i}`,
						);
						const workMessage: ToWorkerMessage = {
							message: 'do work',
							queueNumber: firstWorkItem.queueNumber,
							contents: firstWorkItem.contents,
						};
						worker.postMessage(workMessage);
					} else {
						console.log(
							`more workers than work items, telling worker #${i} to exit`,
						);
						worker.postMessage({ message: 'exit' });
					}
					break;
				}
				case 'work completed':
					if (event.data.queueNumber != undefined) {
						if (
							markItemComplete(workQueue, event.data.queueNumber)
						) {
							const nextWorkItem = takeFromQueue(workQueue);
							if (nextWorkItem != null) {
								const nextWorkMessage: ToWorkerMessage = {
									message: 'do work',
									queueNumber: nextWorkItem.queueNumber,
									contents: nextWorkItem.contents,
								};
								worker.postMessage(nextWorkMessage);
							} else {
								//console.log(`No more available items left in work queue, telling worker #${i} to exit`)
								worker.postMessage({ message: 'exit' });
							}
						} else {
							throw ('attempting to mark an item that was not in progress as complete');
						}
					} else {
						throw (`malformed message from worker #${i}, queueNumber is undefined`);
					}
					break;
				default:
					break;
			}
		};
	}
}

main();

//Create a dummy worker to keep main process alive
// const workerURL = new URL("worker.ts", import.meta.url).href
// const worker = new Worker(workerURL)
