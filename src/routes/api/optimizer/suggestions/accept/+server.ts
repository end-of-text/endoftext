import { env } from '$env/dynamic/private';
import { OpenAILLM } from '$lib/server/llms/openai.js';
import { optimizers } from '$lib/server/optimizers/optimizers.js';
import type { Tables } from '$lib/supabase.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals: { getSession } }) {
	const session = await getSession();

	if (!session) {
		error(401, 'Forbidden');
	}

	const requestData = await request.json();
	const selectedPrompt = requestData.selectedPrompt as string | undefined;
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
	const optimizer = optimizers.find((o) => o.type === suggestion.type);
	if (!optimizer) {
		error(500, 'Could not find optimizer');
	}

	const prompt = await optimizer.apply(selectedPrompt, new OpenAILLM(env.OPENAI_API_KEY || ''));
	return json({ prompt });
}
