import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { getSession, supabase }, params }) => {
		const session = await getSession();

		if (!session) {
			return {
				status: 401,
				body: 'Forbidden'
			};
		}

		const formData = await request.formData();
		const prompt = formData.get('prompt');

		if (prompt) {
			await supabase.from('prompts').insert({ project_id: params.id, prompt: prompt });
		}

		redirect(303, '/project/' + params.id + '/new/data');
	}
};
