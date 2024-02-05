import { chrfMetric } from '$lib/server/metrics/index.js';
import type { Tables } from '$lib/supabase.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ locals: { supabase, getSession }, request }) {
	const session = getSession();
	if (!session) {
		error(401, 'Forbidden');
	}

	const requestData = await request.json();
	const instance = requestData.instance as Tables<'instances'> | undefined;
	if (!instance) {
		error(500, 'Invalid instance data');
	}

	const prediction = requestData.prediction as Tables<'predictions'> | undefined;
	if (!prediction) {
		error(500, 'Invalid prediction data');
	}

	const fetchRes = await supabase
		.from('metrics')
		.select('id, prediction_id, metric_name, metric')
		.eq('prediction_id', prediction.id);

	if (fetchRes.data && fetchRes.data.length > 0) {
		return json(fetchRes.data[0]);
	}

	const metric = chrfMetric(instance.label!, prediction.prediction);
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
