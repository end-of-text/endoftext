import { redirect } from '@sveltejs/kit';

export async function load({ locals: { supabase, getSession }, params }) {
	const session = getSession();

	if (!session) {
		return {
			status: 401,
			body: 'Forbidden'
		};
	}

	const promptsReq = supabase.from('prompts').select('id, prompt').eq('project_id', params.id);

	const instancesReq = supabase
		.from('instances')
		.select('id, input, label')
		.eq('project_id', params.id);

	const [promptsRes, instancesRes] = await Promise.all([promptsReq, instancesReq]);

	if (promptsRes.error || instancesRes.error) {
		return {
			status: 500,
			body: 'Internal Server Error'
		};
	}

	if (promptsRes.data.length === 0) {
		redirect(303, '/project/' + params.id + '/new/prompt');
	} else if (instancesRes.data.length === 0) {
		redirect(303, '/project/' + params.id + '/new/data');
	} else {
		return {
			prompts: promptsRes.data,
			instances: instancesRes.data
		};
	}
}
