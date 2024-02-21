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

	const { data: prompts, error: promptsError } = await supabase
		.from('prompts')
		.select('id, projects(user_id)', { count: 'exact' })
		.eq('projects.user_id', session.user.id)
		.gt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

	if (promptsError) {
		error(500, promptsError.message);
	}

	const { data: subscription, error: err } = await supabase
		.from('user_subscription')
		.select('status, stripe_id')
		.eq('id', session.user.id)
		.single();

	if (err) {
		error(500, err.message);
	} else if (prompts.length >= 100 && !subscription.status) {
		error(403, 'You have reached the maximum number of prompts allowed for the month');
	}

	const res = await supabase
		.from('prompts')
		.insert({ ...prompt, id: undefined, created_at: undefined, parent_prompt_id: prompt.id })
		.select();

	if (res.error) {
		error(500, res.error.message);
	}

	trackEvent('New Prompt', { user_id: session.user.id }, { project_id: prompt.project_id });
	return json(res.data[0]);
}
