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
			const { error, data: prompts } = await supabase
				.from('prompts')
				.select('id')
				.eq('project_id', params.id);

			if (error) {
				return {
					status: 500,
					body: 'Internal Server Error'
				};
			}

			if (prompts.length === 0) {
				await supabase.from('prompts').insert({ project_id: params.id, prompt: prompt });
			} else {
				await supabase
					.from('prompts')
					.update({ id: prompts[0].id, project_id: params.id, prompt: prompt })
					.eq('id', prompts[0].id);
			}
		}

		redirect(303, '/project/' + params.id + '/new/data');
	}
};
