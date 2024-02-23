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

	if (promptReq.error || promptReq.data.length === 0) {
		error(500, 'Failed to load prompt');
	} else {
		redirect(302, `/project/${params.id}/${promptReq.data[0].id}`);
	}
}
