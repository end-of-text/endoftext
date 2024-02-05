import type { Tables } from '$lib/supabase';
import { redirect } from '@sveltejs/kit';

export async function load({ params, locals: { getSession, supabase } }) {
	const session = getSession();

	if (!session) {
		return {
			status: 401,
			body: 'Forbidden'
		};
	}

	const { data, error } = await supabase
		.from('prompts')
		.select('prompt')
		.eq('project_id', params.id);

	if (error) {
		return {
			status: 500,
			body: 'Internal Server Error'
		};
	}

	if (data && data.length > 0) {
		redirect(303, '/project/' + params.id);
	}

	return {
		prompt: data[0] as Tables<'prompts'>
	};
}
