import { trackEvent } from '$lib/server/amplitude.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ depends, locals: { supabase } }) {
	depends('home_entries');

	const res = await supabase
		.from('home_entries')
		.select('*')
		.order('updated_at', { ascending: false });

	if (res.error) {
		error(500, res.error.message);
	}

	return {
		projects: res.data
	};
}

export const actions = {
	create: async ({ locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session) {
			return {
				status: 401,
				body: 'Forbidden'
			};
		}

		const projectRes = await supabase
			.from('projects')
			.insert({ user_id: session.user.id, name: 'New Prompt' })
			.select();

		if (projectRes.error || (projectRes.data && projectRes.data.length === 0)) {
			error(500, "Couldn't create project");
		} else {
			trackEvent('Prompt Created', { user_id: session.user.id });
			redirect(303, '/new/' + projectRes.data[0].id + '/prompt');
		}
	}
};
