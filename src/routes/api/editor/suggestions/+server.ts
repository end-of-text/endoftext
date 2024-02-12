import { OPENAI_API_KEY } from '$env/static/private';
import { editors } from '$lib/server/editors/editors.js';
import { OpenAILLM } from '$lib/server/llms/openai.js';
import type { Tables } from '$lib/supabase.js';
import { track } from '@amplitude/analytics-node';
import { error, json } from '@sveltejs/kit';

export async function POST({ locals: { supabase, getSession }, request }) {
	const session = await getSession();
	if (!session) {
		error(401, 'Forbidden');
	}

	const requestData = await request.json();
	const selectedPrompt = requestData.selectedPrompt as Tables<'prompts'> | undefined;
	if (!selectedPrompt) {
		error(500, 'Invalid prompt data');
	}

	const clear = requestData.clear as boolean;
	if (clear) {
		// Delete all entries from the DB
		await supabase.from('suggestions').delete().eq('prompt_id', selectedPrompt.id);
	} else {
		// Fetch all suggestions from the DB and return if some are found
		const fetchRes = await supabase
			.from('suggestions')
			.select('*')
			.eq('prompt_id', selectedPrompt.id);

		if (fetchRes.data && fetchRes.data.length > 0) {
			return json(fetchRes.data);
		}
	}

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
	const llm = new OpenAILLM(OPENAI_API_KEY || '');
	const results = await Promise.all(
		editors.map(async (e) => {
			const applicable = await e.filter(selectedPrompt, llm, instanceRes.data);
			return { applicable, editor: e };
		})
	);

	const suggestions: Tables<'suggestions'>[] = [];
	for (const result of results) {
		if (result.applicable) {
			const insertRes = await supabase
				.from('suggestions')
				.insert({
					prompt_id: selectedPrompt.id,
					name: result.editor.name,
					description: result.editor.description,
					identifier: result.editor.id,
					type: result.editor.type,
					required_input_type: result.editor.requiredInputType
				})
				.select();
			if (insertRes.data && insertRes.data.length > 0) {
				track('Suggestion Created', {
					user_id: session.user.id,
					suggestion_name: result.editor.name
				});
				suggestions.push(insertRes.data[0]);
			}
		}
	}

	return json(suggestions);
}
