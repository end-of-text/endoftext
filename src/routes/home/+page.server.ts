export async function load({ locals: { supabase, getSession } }) {
	const session = getSession();

	if (!session) {
		return {
			status: 401,
			body: 'Forbidden'
		};
	}

	const res = await supabase.from('projects').select('id, name');

	if (res.error) {
		return {
			status: 500,
			body: 'Internal Server Error'
		};
	}

	return {
		projects: res.data
	};
}

export const actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session) {
			return {
				status: 401,
				body: 'Forbidden'
			};
		}

		const formData = await request.formData();

		await supabase
			.from('projects')
			.insert({ user_id: session.user.id, name: formData.get('name') });
	}
};
