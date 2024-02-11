import { OPENAI_API_KEY } from '$env/static/private';
import { editors } from '$lib/server/editors/editors.js';
import { OpenAILLM } from '$lib/server/llms/openai.js';
import type { Tables } from '$lib/supabase.js';
import { track } from '@amplitude/analytics-node';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals: { supabase, getSession } }) {
	const session = await getSession();

	if (!session) {
		error(401, 'Forbidden');
	}

	const requestData = await request.json();
	const prompt = requestData.prompt as Tables<'prompts'> | undefined;
	if (!prompt) {
		error(500, 'Invalid prompt data');
	}
	const suggestion = requestData.suggestion as Tables<'suggestions'> | undefined;
	if (!suggestion) {
		error(500, 'Invalid suggestion data');
	}

	const editor = editors.find((o) => o.id === suggestion.identifier);
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
	const newPrompt = await editor.apply(prompt, llm, instanceRes.data, userInput);

	track('Suggestion Accepted', { user_id: session.user.email, suggestion_type: editor.type });
	return json({ prompt: newPrompt });
}
