import { OPENAI_API_KEY } from '$env/static/private';
import { trackEvent } from '$lib/server/amplitude.js';
import { rewriteSentences } from '$lib/server/editors/util.js';
import { OpenAILLM } from '$lib/server/llms/openai.js';
import type { Tables } from '$lib/supabase.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals: { getSession } }) {
	const session = await getSession();

	if (!session) {
		error(401, 'Forbidden');
	}

	const requestData = await request.json();
	const prompt = requestData.prompt as Tables<'prompts'> | undefined;
	if (!prompt) {
		error(500, 'Invalid prompt data');
	}
	const selectedText = requestData.selectedText as string;
	const rewriteCommand = requestData.rewriteCommand as string;

	const llm = new OpenAILLM(OPENAI_API_KEY || '');

	const startIndex = prompt.prompt.indexOf(selectedText);
	const endIndex = startIndex + selectedText.length;
	const newPrompt = await rewriteSentences(
		prompt.prompt,
		[[startIndex, endIndex]],
		llm,
		rewriteCommand
	);

	trackEvent(
		'Rewrite Applied',
		{ user_id: session.user.id },
		{ prompt: prompt.prompt, rewriteCommand: rewriteCommand, selectedText: selectedText }
	);
	return json({ prompt: newPrompt });
}
