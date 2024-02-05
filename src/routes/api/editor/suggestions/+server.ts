import { env } from '$env/dynamic/private';
import { editors } from '$lib/server/editors/editors.js';
import { OpenAILLM } from '$lib/server/llms/openai.js';
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

	const instanceUpdated = requestData.instanceUpdated as number | undefined;

	if (instanceUpdated === undefined) {
		const fetchRes = await supabase
			.from('suggestions')
			.select('*')
			.eq('prompt_id', selectedPrompt.id);

		if (fetchRes.data && fetchRes.data.length > 0) {
			suggestions.push(...fetchRes.data);
			return json(suggestions);
		}
	} else {
		await supabase.from('suggestions').delete().eq('prompt_id', selectedPrompt.id);
	}

	const llm = new OpenAILLM(env.OPENAI_API_KEY || '');
	const instanceRes = await supabase
		.from('instances')
		.select('id, input, label, predictions!inner(prediction)')
		.eq('project_id', selectedPrompt.project_id)
		.eq('predictions.prompt_id', selectedPrompt.id)
		.neq('label', '')
		.order('id', { ascending: true });
	if (instanceRes.data === null) {
		return json([]);
	}

	const results = await Promise.all(
		editors.map(async (e) => {
			const applicable = await e.filter(selectedPrompt.prompt, llm, instanceRes.data);
			return { applicable, editor: e };
		})
	);

	for (const result of results) {
		if (result.applicable) {
			const insertRes = await supabase
				.from('suggestions')
				.insert({
					prompt_id: selectedPrompt.id,
					name: result.editor.name,
					description: result.editor.description,
					identifier: result.editor.id,
					type: result.editor.type
				})
				.select();
			if (insertRes.data && insertRes.data.length > 0) {
				suggestions.push(insertRes.data[0]);
			}
		}
	}

	return json(suggestions);
}