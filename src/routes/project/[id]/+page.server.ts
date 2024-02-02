import type { Tables } from '$lib/supabase.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals: { supabase, getSession }, params }) {
	const session = getSession();

	if (!session) {
		return {
			status: 401,
			body: 'Forbidden'
		};
	}

	const promptsReq = supabase
		.from('prompts')
		.select('id, prompt, created_at')
		.eq('project_id', params.id)
		.order('created_at', { ascending: false });

	const instancesReq = supabase
		.from('instances')
		.select('id, input, label')
		.eq('project_id', params.id)
		.order('created_at', { ascending: false });

	const [promptsRes, instancesRes] = await Promise.all([promptsReq, instancesReq]);

	if (promptsRes.error || instancesRes.error) {
		return {
			status: 500,
			body: 'Internal Server Error'
		};
	}

	if (promptsRes.data.length === 0) {
		redirect(303, '/project/' + params.id + '/new/prompt');
	} else if (instancesRes.data.length === 0) {
		redirect(303, '/project/' + params.id + '/new/data');
	} else {
		return {
			projectId: params.id,
			prompts: promptsRes.data as Tables<'prompts'>[],
			instances: instancesRes.data as Tables<'instances'>[]
		};
	}
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
