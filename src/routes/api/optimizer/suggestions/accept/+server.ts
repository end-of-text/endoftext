import { env } from '$env/dynamic/private';
import { OpenAILLM } from '$lib/server/llms/openai.js';
import { getOptimizer } from '$lib/server/optimizers/optimizers.js';
import type { Tables } from '$lib/supabase.js';

export async function POST({ request, locals: { supabase, getSession } }) {
	const session = await getSession();

	if (!session) {
		return new Response('Forbidden', { status: 401 });
	}

	const requestData = await request.json();
	const selectedPrompt = requestData.selectedPrompt as Tables<'prompts'> | undefined;
	if (!selectedPrompt) {
		return new Response('Internal Server Error', { status: 500 });
	}
	const suggestion = requestData.suggestion as Tables<'suggestions'>;
	const projectID = requestData.projectID;
	const optimizer = getOptimizer(suggestion.type, new OpenAILLM(env.OPENAI_API_KEY));
	if (!optimizer) {
		return new Response('Could not instantiate optimizer.', { status: 500 });
	}
	const prompt = await optimizer.apply(selectedPrompt.prompt);
	await supabase
		.from('prompts')
		.insert({ prompt, project_id: projectID, parent_prompt_id: selectedPrompt.id });
	return new Response(null, { status: 200 });
}
