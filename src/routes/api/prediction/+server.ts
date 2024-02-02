import { openai } from '$lib/server/openai.js';
import type { Instance, Prompt } from '$lib/types.js';

export async function POST({ locals: { supabase, getSession }, request }) {
	const session = getSession();
	if (!session) {
		return new Response('Forbidden', { status: 401 });
	}

	const requestData = await request.json();
	const selectedPrompt = requestData.selectedPrompt as Prompt;
	if (!selectedPrompt) {
		return new Response('Internal Server Error', { status: 500 });
	}

	const instance = requestData.instance as Instance;
	if (!instance) {
		return new Response('Internal Server Error', { status: 500 });
	}

	const fetchRes = await supabase
		.from('predictions')
		.select('id, prediction, instance_id, prompt_id')
		.eq('instance_id', instance.id)
		.eq('prompt_id', selectedPrompt.id);

	if (fetchRes.data && fetchRes.data.length > 0) {
		return new Response(JSON.stringify(fetchRes.data[0]), { status: 200 });
	}

	const prediction = await openai.generate([
		{ role: 'system', content: selectedPrompt.prompt },
		{ role: 'user', content: instance.input }
	]);
	const insertRes = await supabase
		.from('predictions')
		.insert({
			prediction: prediction,
			instance_id: instance.id,
			prompt_id: selectedPrompt.id
		})
		.select();
	if (insertRes.data && insertRes.data.length > 0) {
		return new Response(JSON.stringify(insertRes.data[0]), { status: 200 });
	}

	return new Response('Internal Server Error', { status: 500 });
}
