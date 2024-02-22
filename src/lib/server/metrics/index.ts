import { computeChrF } from './chrf';

export function chrfMetric(reference: string, hypothesis: string): number {
	return computeChrF(reference, hypothesis);
}

export function exactMatchMetric(hyp: string, ref: string): number {
	return hyp === ref ? 1 : 0;
}

export function fuzzyMatchMetric(hyp: string, ref: string): number {
	return ref.includes(hyp) ? 1 : 0;
}

export function lengthMetric(hyp: string, ref: string): number {
	return ref.length - hyp.length;
}

export function getMetricFunction(name: string): (hyp: string, ref: string) => number {
	switch (name) {
		case 'chrf':
			return chrfMetric;
		case 'exact match':
			return exactMatchMetric;
		case 'fuzzy match':
			return fuzzyMatchMetric;
		case 'length':
			return lengthMetric;
		default:
			throw new Error(`Unknown metric: ${name}`);
	}
}
