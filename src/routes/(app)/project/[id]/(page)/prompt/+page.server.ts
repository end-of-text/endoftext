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
