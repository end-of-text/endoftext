import { env } from '$env/dynamic/private';
import { OpenAILLM } from '$lib/server/llms/openai';
import type { Tables } from '$lib/supabase.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ locals: { supabase, getSession }, request }) {
	const session = getSession();
	if (!session) {
		error(401, 'Forbidden');
	}

	const requestData = await request.json();
	const prompt = requestData.prompt as Tables<'prompts'> | undefined;
	const instance = requestData.instance as Tables<'instances'> | undefined;
	if (!prompt || !instance) {
		error(500, 'Invalid data');
	}

	const cacheRes = await supabase
		.from('predictions')
		.select('prediction')
		.eq('prompt_id', prompt.id)
		.eq('instance_id', instance.id);

	if (cacheRes.error) {
		error(500, cacheRes.error.message);
	} else if (cacheRes.data && cacheRes.data.length > 0) {
		return json({ output: cacheRes.data[0].prediction });
	}

	const openai = new OpenAILLM(env.OPENAI_API_KEY || '');
	const prediction = await openai.generate([
		{ role: 'system', content: prompt.prompt },
		{ role: 'user', content: instance.input }
	]);

	const res = await supabase.from('predictions').insert({
		instance_id: instance.id,
		prompt_id: prompt.id,
		prediction: prediction
	});

	if (res.error) {
		error(500, res.error.message);
	}

	return json({ output: prediction });
}
