import { OPENAI_API_KEY } from '$env/static/private';
import { trackEvent } from '$lib/server/amplitude.js';
import { getEditors } from '$lib/server/editors/editors.js';
import { OpenAILLM } from '$lib/server/llms/openai.js';
import type { Tables } from '$lib/supabase.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals: { supabase, getSession } }) {
	const session = await getSession();
	const requestData = await request.json();
	const prompt = requestData.prompt as Tables<'prompts'> | undefined;
	if (!prompt) {
		error(500, 'Invalid prompt data');
	}
	const suggestion = requestData.suggestion as Tables<'suggestions'> | undefined;
	if (!suggestion) {
		error(500, 'Invalid suggestion data');
	}

	const editor = getEditors().find((o) => o.id === suggestion.identifier);
	if (!editor) {
		error(500, 'Could not find editor');
	}

	const userInput = requestData.userInput as string | undefined;

	const instanceRes = await supabase
		.from('instances')
		.select('id, input, label, predictions!inner(prediction)')
		.eq('project_id', prompt.project_id)
		.eq('predictions.prompt_id', prompt.id)
		.neq('label', '')
		.order('id', { ascending: true });

	if (instanceRes.error) {
		error(500, instanceRes.error.message);
	}

	if (instanceRes.data === null) {
		return json({ prompt: prompt });
	}

	const llm = new OpenAILLM(OPENAI_API_KEY || '');
	const newPrompt = await editor.rewritePrompt(
		prompt,
		suggestion.target_spans || [],
		llm,
		instanceRes.data,
		userInput
	);

	trackEvent(
		'Suggestion Accepted',
		{ user_id: session?.user.id ?? '' },
		{ editor_name: editor.name }
	);
	return json({ prompt: newPrompt });
}
