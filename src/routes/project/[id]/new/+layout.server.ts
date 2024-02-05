import type { Tables } from '$lib/supabase';

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
		.eq('project_id', params.id)
		.order('created_at', { ascending: false });

	if (error) {
		return {
			status: 500,
			body: 'Internal Server Error'
		};
	}

	return {
		prompt: data[0] as Tables<'prompts'>
	};
}
