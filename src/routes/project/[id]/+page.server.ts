import type { Tables } from '$lib/supabase.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals: { supabase, getSession }, params }) {
	const session = getSession();

	if (!session) {
		error(401, { message: 'Forbidden' });
	}

	const promptsReq = supabase
		.from('prompts')
		.select('*')
		.eq('project_id', params.id)
		.order('created_at', { ascending: false });

	const instancesReq = supabase
		.from('instances')
		.select('id, input, label')
		.eq('project_id', params.id)
		.order('id', { ascending: true });

	const [promptsRes, instancesRes] = await Promise.all([promptsReq, instancesReq]);

	if (promptsRes.error || instancesRes.error) {
		error(505, { message: 'Failed to get prompts and instances' });
	}

	if (promptsRes.data.length === 0) {
		redirect(303, '/project/' + params.id + '/new/prompt');
	}

	return {
		projectId: params.id,
		prompt: promptsRes.data[0] as Tables<'prompts'>,
		instances: instancesRes.data as Tables<'instances'>[]
	};
}

export const actions = {
	copyPrompt: async ({ params, request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session) {
			return {
				status: 401,
				body: 'Forbidden'
			};
		}

		const formData = await request.formData();
		const prompt = JSON.parse(formData.get('prompt') as string) as Tables<'prompts'> | undefined;

		if (prompt) {
			await supabase
				.from('prompts')
				.insert({ prompt: prompt.prompt, project_id: params.id, parent_prompt_id: prompt.id });
		}
	},
	editPrompt: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session) {
			return {
				status: 401,
				body: 'Forbidden'
			};
		}

		const formData = await request.formData();
		const newPrompt = formData.get('newPrompt');
		const promptId = formData.get('promptId');

		if (newPrompt) {
			await supabase.from('prompts').update({ prompt: newPrompt }).eq('id', promptId);
		}
	},
	deletePrompt: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session) {
			return {
				status: 401,
				body: 'Forbidden'
			};
		}

		const formData = await request.formData();
		const promptId = formData.get('promptId');
		await supabase.from('prompts').delete().eq('id', promptId);
	}
};
