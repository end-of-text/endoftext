import { OPENAI_API_KEY } from '$env/static/private';
import { trackEvent } from '$lib/server/amplitude.js';
import { OpenAILLM } from '$lib/server/llms/openai';
import type { Tables } from '$lib/supabase.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ locals: { supabase, getSession }, request }) {
	const session = await getSession();
	if (!session) {
		error(401, 'Forbidden');
	}

	const requestData = await request.json();
	const prompt = requestData.prompt as Tables<'prompts'> | undefined;
	const instanceId = requestData.instanceId as number | undefined;
	const input = requestData.input as string | undefined;
	const clear = requestData.clear as boolean;
	if (!prompt || !instanceId || !input) {
		error(500, 'Invalid data');
	}

	if (clear) {
		await supabase
			.from('predictions')
			.delete()
			.eq('prompt_id', prompt.id)
			.eq('instance_id', instanceId);
	} else {
		const cacheRes = await supabase
			.from('predictions')
			.select('*')
			.eq('prompt_id', prompt.id)
			.eq('instance_id', instanceId);

		if (cacheRes.error) {
			error(500, cacheRes.error.message);
		} else if (cacheRes.data && cacheRes.data.length > 0) {
			return json({ prediction: cacheRes.data[0] });
		}
	}

	const openai = new OpenAILLM(OPENAI_API_KEY || '');
	const prediction = await openai.generate(
		[
			{ role: 'system', content: prompt.prompt },
			{ role: 'user', content: input }
		],
		{
			model: prompt.model,
			temperature: prompt.temperature,
			json: prompt.responseFormat === 'json'
		}
	);

	const res = await supabase
		.from('predictions')
		.insert({
			instance_id: instanceId,
			prompt_id: prompt.id,
			prediction: prediction
		})
		.select();

	if (res.error) {
		error(500, res.error.message);
	}

	trackEvent('Prediction Generated', { user_id: session.user.id });
	return json({ prediction: res.data[0] });
}
