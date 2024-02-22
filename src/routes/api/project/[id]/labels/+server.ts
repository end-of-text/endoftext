import { error, json } from '@sveltejs/kit';

export async function POST({ params, request, locals: { supabase } }) {
	const requestData = await request.json();
	const showLabels = requestData.showLabels;
	const projectMetric = requestData.projectMetric as string | null;

	const projectUpdate: Record<string, unknown> = { show_labels: showLabels };
	if (showLabels && projectMetric === null) {
		projectUpdate['metric_name'] = 'chrf';
	}

	const res = await supabase.from('projects').update(projectUpdate).eq('id', params.id).select();

	if (res.error) {
		error(500, res.error.message);
	}
	return json(res.data[0]);
}
