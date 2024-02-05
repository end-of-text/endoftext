import type { Tables } from '$lib/supabase';
import { error, json } from '@sveltejs/kit';

export async function POST({ locals: { supabase, getSession }, request }) {
	const session = getSession();
	if (!session) {
		error(401, 'Forbidden');
	}

	const requestData = await request.json();
	const prompt = requestData.prompt as Tables<'prompts'>;
	if (!prompt) {
		error(500, 'Invalid prompt data');
	}

	const { id, ...promptWithoutId } = prompt;

	const res = await supabase
		.from('prompts')
		.insert({ ...promptWithoutId, parent_prompt_id: id })
		.select();

	if (res.error) {
		error(500, res.error.message);
	}

	return json(res.data[0]);
}
