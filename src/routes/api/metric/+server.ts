import { getMetricFunction } from '$lib/server/metrics/index.js';
import type { Tables } from '$lib/supabase.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const requestData = await request.json();
	const label = requestData.label as string;
	const metricName = requestData.metricName as string;
	const prediction = requestData.prediction as Tables<'predictions'>;
	const prompt = requestData.prompt as Tables<'prompts'>;

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

	return json(metric);
}
