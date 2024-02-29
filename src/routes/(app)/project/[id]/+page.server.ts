import { error, redirect } from '@sveltejs/kit';

export async function load({ locals: { getSession, supabase }, params }) {
	const session = getSession();
	if (!session) {
		redirect(302, '/login');
	}

	const promptReq = await supabase
		.from('prompts')
		.select('*')
		.eq('project_id', params.id)
		.order('created_at', { ascending: false });

	if (promptReq.error) {
		error(500, 'Failed to load prompt');
	} else if (promptReq.data.length === 0) {
		redirect(303, `/new/${params.id}/prompt`);
	} else {
		redirect(302, `/project/${params.id}/${promptReq.data[0].id}`);
	}
}
