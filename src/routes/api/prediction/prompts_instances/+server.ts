import { OPENAI_API_KEY } from '$env/static/private';
import { OpenAILLM } from '$lib/server/llms/openai.js';
import { generateAndSave } from '$lib/server/predictions/getPredictions.js';
import type { Tables } from '$lib/supabase.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ locals: { supabase }, request }) {
	const requestData = await request.json();
	const instances = requestData.instances as Tables<'instances'>[];
	const prompts = requestData.prompts as Tables<'prompts'>[];

	const existingPredictionsRes = await supabase
		.from('predictions')
		.select('*')
		.in(
			'prompt_id',
			prompts.map((p) => p.id)
		)
		.in(
			'instance_id',
			instances.map((i) => i.id)
		);

	if (existingPredictionsRes.error) {
		error(500, existingPredictionsRes.error.message);
	}

	const structuredPreds = existingPredictionsRes.data.reduce((record, obj) => {
		if (!record[obj.instance_id]) {
			record[obj.instance_id] = {};
		}
		record[obj.instance_id][obj.prompt_id] = obj.prediction;
		return record;
	}, {}) as Record<number, Record<number, string>>;

	const openai = new OpenAILLM(OPENAI_API_KEY || '');
	for (const instance of instances) {
		if (!structuredPreds[instance.id]) {
			structuredPreds[instance.id] = {};
		}
		for (const prompt of prompts) {
			if (!structuredPreds[instance.id][prompt.id]) {
				structuredPreds[instance.id][prompt.id] =
					(await generateAndSave(supabase, openai, prompt, instance)) ?? '';
			}
		}
	}

	return json(structuredPreds);
}
