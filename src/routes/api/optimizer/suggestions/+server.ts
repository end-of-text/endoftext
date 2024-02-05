import { env } from '$env/dynamic/private';
import { OpenAILLM } from '$lib/server/llms/openai.js';
import { optimizers } from '$lib/server/optimizers/optimizers.js';
import type { Tables } from '$lib/supabase.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ locals: { supabase, getSession }, request }) {
	const session = getSession();
	if (!session) {
		error(401, 'Forbidden');
	}

	const requestData = await request.json();
	const selectedPrompt = requestData.selectedPrompt as Tables<'prompts'> | undefined;
	if (!selectedPrompt) {
		error(500, 'Invalid prompt data');
	}

	const suggestions: Tables<'suggestions'>[] = [];

	const fetchRes = await supabase
		.from('suggestions')
		.select('id, prompt_id, name, description, type, created_at')
		.eq('prompt_id', selectedPrompt.id);

	if (fetchRes.data && fetchRes.data.length > 0) {
		suggestions.push(...fetchRes.data);
		return json(suggestions);
	}

	const llm = new OpenAILLM(env.OPENAI_API_KEY || '');
	const results = await Promise.all(
		optimizers.map(async (o) => {
			const applicable = await o.filter(selectedPrompt.prompt, llm);
			return { applicable, optimizer: o };
		})
	);

	for (const result of results) {
		if (result.applicable) {
			const insertRes = await supabase
				.from('suggestions')
				.insert({
					prompt_id: selectedPrompt.id,
					name: result.optimizer.name,
					description: result.optimizer.description,
					type: result.optimizer.type
				})
				.select();
			if (insertRes.data && insertRes.data.length > 0) {
				suggestions.push(insertRes.data[0]);
			}
		}
	}

	return json(suggestions);
}
