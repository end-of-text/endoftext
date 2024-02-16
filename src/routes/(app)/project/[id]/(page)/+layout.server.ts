import type { Tables } from '$lib/supabase.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals: { supabase, getSession }, params }) {
	const session = getSession();

	if (!session) {
		error(401, { message: 'Forbidden' });
	}

	const projectReq = supabase.from('projects').select('*').eq('id', params.id);

	const promptsReq = supabase
		.from('prompts')
		.select('*')
		.eq('project_id', params.id)
		.order('created_at', { ascending: false });

	const [promptsRes, projectRes] = await Promise.all([promptsReq, projectReq]);

	if (promptsRes.error || projectRes.error) {
		error(505, { message: 'Failed to get project or prompts' });
	}

	if (promptsRes.data.length === 0) {
		redirect(303, '/project/' + params.id + '/new/prompt');
	}

	return {
		project: projectRes.data[0] as Tables<'projects'>,
		prompt: promptsRes.data[0] as Tables<'prompts'>
	};
}
