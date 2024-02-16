import type { Tables } from '$lib/supabase.js';
import { error } from '@sveltejs/kit';

export async function load({ locals: { supabase, getSession }, params }) {
	const session = getSession();

	if (!session) {
		error(401, { message: 'Forbidden' });
	}

	const instancesReq = await supabase
		.from('instances')
		.select('*')
		.eq('project_id', params.id)
		.order('id', { ascending: true });

	if (instancesReq.error) {
		error(505, { message: 'Failed to get instances' });
	}

	return {
		instances: instancesReq.data as Tables<'instances'>[]
	};
}

export const actions = {
	updateName: async ({ request, locals: { supabase, getSession }, params }) => {
		const session = await getSession();

		if (!session) {
			return {
				status: 401,
				body: 'Forbidden'
			};
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;

		await supabase.from('projects').update({ name }).eq('id', params.id);
	}
};
