import type { Tables } from '$lib/supabase.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals: { supabase, getSession }, params }) {
	const session = getSession();

	if (!session) {
		error(401, { message: 'Forbidden' });
	}

	const projectReq = supabase.from('projects').select('*').eq('id', params.id);

	const promptsReq = supabase
		.from('prompts')
		.select('*')
		.eq('project_id', params.id)
		.order('created_at', { ascending: false });

	const instancesReq = supabase
		.from('instances')
		.select('*')
		.eq('project_id', params.id)
		.order('id', { ascending: true });

	const [promptsRes, instancesRes, projectRes] = await Promise.all([
		promptsReq,
		instancesReq,
		projectReq
	]);

	if (promptsRes.error || instancesRes.error || projectRes.error) {
		error(505, { message: 'Failed to get project, prompts, or instances' });
	}

	if (promptsRes.data.length === 0) {
		redirect(303, '/project/' + params.id + '/new/prompt');
	}

	return {
		project: projectRes.data[0] as Tables<'projects'>,
		prompt: promptsRes.data[0] as Tables<'prompts'>,
		instances: instancesRes.data as Tables<'instances'>[]
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
	},
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
