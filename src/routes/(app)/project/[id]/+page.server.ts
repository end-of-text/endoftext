import { getPredictions } from '$lib/server/predictions/getPredictions';
import type { Tables } from '$lib/supabase.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ depends, locals: { supabase }, params }) {
	depends('prompt');

	const projectReq = supabase.from('projects').select('*').eq('id', params.id);

	const promptsReq = supabase
		.from('prompts')
		.select('*')
		.eq('project_id', params.id)
		.order('created_at', { ascending: false });

	const instancesReq = await supabase
		.from('instances')
		.select('*')
		.eq('project_id', params.id)
		.order('id', { ascending: true });

	const [promptsRes, projectRes, instancesRes] = await Promise.all([
		promptsReq,
		projectReq,
		instancesReq
	]);

	if (promptsRes.error || projectRes.error || instancesRes.error) {
		error(505, { message: 'Failed to get project, prompts, or instances' });
	}

	if (promptsRes.data.length === 0) {
		redirect(303, '/project/' + params.id + '/new/prompt');
	}

	const { data: existingPredictions, error: err } = await supabase
		.from('predictions')
		.select('*')
		.eq('prompt_id', promptsRes.data[0].id);

	if (err) {
		error(500, err.message);
	}

	const predictions = getPredictions(
		supabase,
		existingPredictions,
		instancesReq.data || [],
		promptsRes.data[0]
	);

	return {
		project: projectRes.data[0] as Tables<'projects'>,
		prompt: promptsRes.data[0] as Tables<'prompts'>,
		instances: instancesReq.data as Tables<'instances'>[],
		predictions
	};
}
