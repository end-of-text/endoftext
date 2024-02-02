import { chrfMetric } from '$lib/server/metrics/index.js';
import type { Tables } from '$lib/supabase.js';

export async function POST({ locals: { supabase, getSession }, request }) {
	const session = getSession();
	if (!session) {
		return new Response('Forbidden', { status: 401 });
	}

	const requestData = await request.json();
	const instance = requestData.instance as Tables<'instances'> | undefined;
	if (!instance) {
		return new Response('Internal Server Error', { status: 500 });
	}

	const prediction = requestData.prediction as Tables<'predictions'> | undefined;
	if (!prediction) {
		return new Response('Internal Server Error', { status: 500 });
	}

	const fetchRes = await supabase
		.from('metrics')
		.select('id, prediction_id, metric_name, metric')
		.eq('prediction_id', prediction.id);

	if (fetchRes.data && fetchRes.data.length > 0) {
		return new Response(JSON.stringify(fetchRes.data[0]), { status: 200 });
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
	if (insertRes.data && insertRes.data.length > 0) {
		return new Response(JSON.stringify(insertRes.data[0]), { status: 200 });
	}

	return new Response('Internal Server Error', { status: 500 });
}
