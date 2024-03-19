import { OPENAI_API_KEY } from '$env/static/private';
import type { Tables } from '$lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { OpenAILLM } from '../llms/openai';

export async function generateAndSave(
	supabase: SupabaseClient,
	openai: OpenAILLM,
	prompt: Tables<'prompts'>,
	instance: Tables<'instances'>
): Promise<string | null> {
	const prediction = await openai.generate(
		[
			{ role: 'system', content: prompt.prompt },
			{ role: 'user', content: instance.input }
		],
		{
			model: prompt.model,
			temperature: prompt.temperature,
			json: prompt.responseFormat === 'json'
		}
	);

	const { error: err } = await supabase
		.from('predictions')
		.insert({ prompt_id: prompt.id, instance_id: instance.id, prediction });

	if (err) {
		error(500, err.message);
	}

	return prediction;
}

export function getPredictions(
	supabase: SupabaseClient,
	existingPredictions: Tables<'predictions'>[],
	instances: Tables<'instances'>[],
	prompt: Tables<'prompts'>
): Record<string, Promise<string | null>> {
	const openai = new OpenAILLM(OPENAI_API_KEY || '');
	const returnPreds: Record<string, Promise<string | null>> = {};
	instances.forEach((instance) => {
		const existingReturn = existingPredictions.find((pred) => pred.instance_id === instance.id);
		if (existingReturn) {
			returnPreds[instance.id] = new Promise((resolve) =>
				resolve(existingReturn.prediction as string)
			);
		} else {
			returnPreds[instance.id] = generateAndSave(supabase, openai, prompt, instance);
		}
	});
	return returnPreds;
}
