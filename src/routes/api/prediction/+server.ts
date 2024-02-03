import { env } from '$env/dynamic/private';
import { OpenAILLM } from '$lib/server/llms/openai';
import type { Tables } from '$lib/supabase.js';

export async function POST({ locals: { supabase, getSession }, request }) {
	const session = getSession();
	if (!session) {
		return new Response('Forbidden', { status: 401 });
	}

	const requestData = await request.json();
	const selectedPrompt = requestData.selectedPrompt as Tables<'prompts'> | undefined;
	const instance = requestData.instance as Tables<'instances'> | undefined;
	if (!selectedPrompt || !instance) {
		return new Response('Internal Server Error', { status: 500 });
	}

	const cacheRes = await supabase
		.from('llm_cache')
		.select('output')
		.eq('prompt', selectedPrompt.prompt)
		.eq('input', instance.input);

	if (cacheRes.error) {
		return new Response('Internal Server Error', { status: 500 });
	} else if (cacheRes.data && cacheRes.data.length > 0) {
		return new Response(JSON.stringify({ output: cacheRes.data[0].output }), { status: 200 });
	}

	const openai = new OpenAILLM(env.OPENAI_API_KEY || '');

	const prediction = await openai.generate([
		{ role: 'system', content: selectedPrompt.prompt },
		{ role: 'user', content: instance.input }
	]);

	const { error } = await supabase.from('llm_cache').insert({
		prompt: selectedPrompt.prompt,
		input: instance.input,
		output: prediction
	});

	if (error) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return new Response(JSON.stringify({ output: prediction }), { status: 200 });
}
