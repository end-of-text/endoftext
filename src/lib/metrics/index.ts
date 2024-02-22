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
