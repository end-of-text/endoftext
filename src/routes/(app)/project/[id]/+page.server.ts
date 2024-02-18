import type { Tables } from '$lib/supabase.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals: { supabase }, params }) {
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

	return {
		project: projectRes.data[0] as Tables<'projects'>,
		prompt: promptsRes.data[0] as Tables<'prompts'>,
		instances: instancesReq.data as Tables<'instances'>[]
	};
}
