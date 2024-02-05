import { env } from '$env/dynamic/private';
import { editors } from '$lib/server/editors/editors.js';
import { OpenAILLM } from '$lib/server/llms/openai.js';
import type { Tables } from '$lib/supabase.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals: { supabase, getSession } }) {
	const session = await getSession();

	if (!session) {
		error(401, 'Forbidden');
	}

	const requestData = await request.json();
	const selectedPrompt = requestData.selectedPrompt as Tables<'prompts'> | undefined;
	if (!selectedPrompt) {
		error(500, 'Invalid prompt data');
	}
	const suggestion = requestData.suggestion as Tables<'suggestions'> | undefined;
	if (!suggestion) {
		error(500, 'Invalid suggestion data');
	}
	const projectID = requestData.projectID as string | undefined;
	if (!projectID) {
		error(500, 'Invalid project ID');
	}
	const editor = editors.find((o) => o.id === suggestion.identifier);
	if (!editor) {
		error(500, 'Could not find editor');
	}

	const instanceRes = await supabase
		.from('instances')
		.select('id, input, label, predictions!inner(prediction)')
		.eq('project_id', selectedPrompt.project_id)
		.eq('predictions.prompt_id', selectedPrompt.id)
		.neq('label', '')
		.order('id', { ascending: true });
	if (instanceRes.data === null) {
		return json({ prompt: selectedPrompt });
	}

	const llm = new OpenAILLM(env.OPENAI_API_KEY || '');
	const prompt = await editor.apply(selectedPrompt.prompt, llm, instanceRes.data);
	return json({ prompt });
}
