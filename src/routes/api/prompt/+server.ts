import { trackEvent } from '$lib/server/amplitude.js';
import type { Tables } from '$lib/supabase';
import { error, json } from '@sveltejs/kit';

export async function POST({ locals: { supabase, getSession }, request }) {
	const session = await getSession();
	if (!session) {
		error(401, 'Forbidden');
	}

	const requestData = await request.json();
	const prompt = requestData.prompt as Tables<'prompts'>;
	if (!prompt) {
		error(500, 'Invalid prompt data');
	}

	const res = await supabase
		.from('prompts')
		.insert({ ...prompt, id: undefined, created_at: undefined, parent_prompt_id: prompt.id })
		.select();

	if (res.error) {
		error(500, res.error.message);
	}

	trackEvent('New Prompt', { project_id: prompt.project_id }, { user_id: session.user.id });
	return json(res.data[0]);
}
