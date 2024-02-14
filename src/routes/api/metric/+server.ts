import { chrfMetric } from '$lib/server/metrics/index.js';
import type { Tables } from '$lib/supabase.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ locals: { supabase, getSession }, request }) {
	const session = getSession();
	if (!session) {
		error(401, 'Forbidden');
	}

	const requestData = await request.json();
	const label = requestData.label as string | undefined;
	if (!label) {
		error(500, 'Invalid label');
	}

	const prediction = requestData.prediction as Tables<'predictions'> | undefined;
	if (!prediction) {
		error(500, 'Invalid prediction data');
	}

	const prompt = requestData.prompt as Tables<'prompts'> | undefined;
	if (!prompt) {
		error(500, 'Invalid project data');
	}

	const fetchRes = await supabase
		.from('metrics')
		.select('id, prediction_id, metric_name, metric')
		.eq('prediction_id', prediction.id);

	if (fetchRes.data && fetchRes.data.length > 0) {
		return json(fetchRes.data[0]);
	}

	let metric: number;
	if (prompt.responseFormat === 'json') {
		metric = chrfMetric(
			// Normalize JSON so that formatting is not an issue.
			JSON.stringify(JSON.parse(label)),
			JSON.stringify(JSON.parse(prediction.prediction))
		);
	} else {
		metric = chrfMetric(label, prediction.prediction);
	}
	const insertRes = await supabase
		.from('metrics')
		.insert({
			prediction_id: prediction.id,
			metric_name: 'chrf',
			metric: metric
		})
		.select();

	if (insertRes.error) {
		error(500, insertRes.error.message);
	} else if (insertRes.data && insertRes.data.length > 0) {
		return json(insertRes.data[0]);
	} else {
		error(500, 'Failed to insert metric');
	}
}
