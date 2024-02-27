import { OPENAI_API_KEY } from '$env/static/private';
import type { RootNode } from '$lib/hypertune/generated';
import type { Tables } from '$lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { OpenAILLM } from '../llms/openai';
import { getEditors } from './editors';

export async function getSuggestions(
	supabase: SupabaseClient,
	prompt: Tables<'prompts'>,
	clear: boolean,
	hypertuneRoot: RootNode
): Promise<Tables<'suggestions'>[]> {
	if (clear) {
		await supabase.from('suggestions').delete().eq('prompt_id', prompt.id);
	} else {
		const fetchRes = await supabase.from('suggestions').select('*').eq('prompt_id', prompt.id);

		if (fetchRes.data && fetchRes.data.length > 0) {
			return fetchRes.data;
		}
	}

	const instanceRes = await supabase
		.from('instances')
		.select('id, input, label, predictions!inner(prediction)')
		.eq('project_id', prompt.project_id)
		.eq('predictions.prompt_id', prompt.id)
		.neq('label', '')
		.order('id', { ascending: true });

	if (instanceRes.data === null) {
		return [];
	}

	const llm = new OpenAILLM(OPENAI_API_KEY || '');
	const results = await Promise.all(
		getEditors(hypertuneRoot).map(async (editor) => {
			const canBeApplied = await editor.canBeApplied(prompt, llm, instanceRes.data);
			return { canBeApplied, editor };
		})
	);

	const suggestions: Tables<'suggestions'>[] = [];
	for (const result of results) {
		if (result.canBeApplied !== null) {
			const insertRes = await supabase
				.from('suggestions')
				.insert({
					prompt_id: prompt.id,
					name: result.editor.name,
					description: result.editor.description,
					identifier: result.editor.id,
					type: result.editor.type,
					required_input_type: result.editor.requiredInputType,
					target_spans: result.canBeApplied
				})
				.select();
			if (insertRes.data && insertRes.data.length > 0) {
				suggestions.push(insertRes.data[0]);
			}
		}
	}

	return suggestions;
}
