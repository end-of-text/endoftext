import type { Tables } from '$lib/supabase';
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

export async function getMetric(
	prompt: Tables<'prompts'>,
	label: string | null,
	predictionPromise: Promise<Tables<'predictions'> | undefined>,
	metricName: string | null
): Promise<number | undefined> {
	const prediction = await predictionPromise;
	if (label === null || metricName === null || label === undefined || prediction === undefined) {
		return;
	}

	const metricFn = getMetricFunction(metricName);

	let metric: number;
	if (prompt.responseFormat === 'json') {
		try {
			metric = metricFn(
				// Normalize JSON so that formatting is not an issue.
				JSON.stringify(JSON.parse(label)),
				JSON.stringify(JSON.parse(prediction.prediction))
			);
		} catch (error) {
			metric = metricFn(label, prediction.prediction);
		}
	} else {
		metric = metricFn(label, prediction.prediction);
	}

	return metric;
}
