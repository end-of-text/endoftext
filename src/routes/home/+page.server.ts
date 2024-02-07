import { error, redirect } from '@sveltejs/kit';

export async function load({ locals: { supabase, getSession } }) {
	const session = getSession();

	if (!session) {
		error(401, 'Forbidden');
	}

	const res = await supabase.from('projects').select('*');

	if (res.error) {
		error(500, res.error.message);
	}

	return {
		projects: res.data
	};
}

export const actions = {
	delete: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session) {
			return {
				status: 401,
				body: 'Forbidden'
			};
		}

		const formData = await request.formData();
		const deleteId = formData.get('delete') as string;

		await supabase.from('projects').delete().eq('id', deleteId);
	},

	create: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session) {
			return {
				status: 401,
				body: 'Forbidden'
			};
		}

		const formData = await request.formData();

		const res = await supabase
			.from('projects')
			.insert({ user_id: session.user.id, name: formData.get('name') })
			.select();

		if (res.error || (res.data && res.data.length === 0)) {
			return {
				status: 500,
				body: "Couldn't create project"
			};
		} else {
			redirect(303, '/project/' + res.data[0].id);
		}
	}
};
