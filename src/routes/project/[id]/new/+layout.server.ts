import type { Tables } from '$lib/supabase';

export async function load({ params, locals: { getSession, supabase } }) {
	const session = getSession();

	if (!session) {
		return {
			status: 401,
			body: 'Forbidden'
		};
	}

	const { data: projectData, error: projectError } = await supabase
		.from('projects')
		.select('*')
		.eq('id', params.id);

	if (projectError) {
		return {
			status: 500,
			body: 'Internal Server Error'
		};
	}

	const { data: promptData, error: promptError } = await supabase
		.from('prompts')
		.select('prompt')
		.eq('project_id', params.id)
		.order('created_at', { ascending: false });

	if (promptError) {
		return {
			status: 500,
			body: 'Internal Server Error'
		};
	}

	return {
		prompt: promptData[0] as Tables<'prompts'>,
		project: projectData[0] as Tables<'projects'>
	};
}
