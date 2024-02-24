import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { supabase }, params }) => {
		const formData = await request.formData();
		const prompt = formData.get('prompt');
		const name = formData.get('name');

		if (prompt) {
			await supabase.from('prompts').insert({ project_id: params.id, prompt: prompt });
		}
		if (name) {
			await supabase.from('projects').update({ name: name }).eq('id', params.id);
		}

		redirect(303, '/new/' + params.id + '/data');
	}
};
