import { env } from '$env/dynamic/private';
import { OpenAILLM } from '$lib/server/llms/openai.js';
import { optimizers } from '$lib/server/optimizers/optimizers.js';
import type { Tables } from '$lib/supabase.js';

export async function POST({ request, locals: { getSession } }) {
	const session = await getSession();

	if (!session) {
		return new Response('Forbidden', { status: 401 });
	}

	const requestData = await request.json();
	const selectedPrompt = requestData.selectedPrompt as string | undefined;
	if (!selectedPrompt) {
		return new Response('Internal Server Error', { status: 500 });
	}
	const suggestion = requestData.suggestion as Tables<'suggestions'> | undefined;
	if (!suggestion) {
		return new Response('Could not instantiate optimizer.', { status: 500 });
	}
	const projectID = requestData.projectID as string | undefined;
	if (!projectID) {
		return new Response('Internal Server Error', { status: 500 });
	}
	const optimizer = optimizers.find((o) => o.type === suggestion.type);
	if (!optimizer) {
		return new Response('Could not instantiate optimizer.', { status: 500 });
	}
	const prompt = await optimizer.apply(selectedPrompt, new OpenAILLM(env.OPENAI_API_KEY || ''));
	return new Response(JSON.stringify({ prompt }), { status: 200 });
}
