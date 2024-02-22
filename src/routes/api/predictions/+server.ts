import { getPredictions } from '$lib/server/predictions/getPredictions.js';
import type { Tables } from '$lib/supabase.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ locals: { supabase, getSession }, request }) {
	const session = await getSession();
	if (!session) {
		error(401, 'Unauthorized');
	}

	const requestData = await request.json();
	const prompt = requestData.prompt as Tables<'prompts'> | undefined;
	const instances = requestData.instances as Tables<'instances'>[] | undefined;
	if (!prompt || !instances || instances.length === 0) {
		error(500, 'Invalid data');
	}

	const cacheRes = await supabase.from('predictions').select('*').eq('prompt_id', prompt.id);

	if (cacheRes.error) {
		error(500, cacheRes.error.message);
	}

	const predPromises = getPredictions(supabase, cacheRes.data, instances, prompt);

	const predictions = await Promise.all(Object.values(predPromises));

	return json({ predictions });
}
