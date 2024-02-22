import { chrfMetric } from '$lib/metrics/index.js';
import type { Tables } from '$lib/supabase.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ locals: { supabase }, request }) {
	const requestData = await request.json();
	const label = requestData.label as string;
	const prediction = requestData.prediction as Tables<'predictions'>;
	const prompt = requestData.prompt as Tables<'prompts'>;
	const clear = requestData.clear as boolean;

	const fetchRes = await supabase
		.from('metrics')
		.select('id, prediction_id, metric_name, metric')
		.eq('prediction_id', prediction.id);

	let id = null;
	if (fetchRes.data && fetchRes.data.length > 0) {
		if (!clear) {
			return json(fetchRes.data[0]);
		}
		id = fetchRes.data[0].id;
	}

	let metric: number;
	if (prompt.responseFormat === 'json') {
		try {
			metric = chrfMetric(
				// Normalize JSON so that formatting is not an issue.
				JSON.stringify(JSON.parse(label)),
				JSON.stringify(JSON.parse(prediction.prediction))
			);
		} catch (error) {
			metric = chrfMetric(label, prediction.prediction);
		}
	} else {
		metric = chrfMetric(label, prediction.prediction);
	}

	const data: Record<string, unknown> = {
		prediction_id: prediction.id,
		metric_name: 'chrf',
		metric: metric
	};
	if (id !== null) {
		data.id = id;
	}
	const insertRes = await supabase.from('metrics').upsert(data).select();

	if (insertRes.error) {
		error(500, insertRes.error.message);
	} else if (insertRes.data && insertRes.data.length > 0) {
		return json(insertRes.data[0]);
	} else {
		error(500, 'Failed to insert metric');
	}
}
