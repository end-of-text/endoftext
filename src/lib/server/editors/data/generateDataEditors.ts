import type { LLM } from '$lib/server/llms/llm';
import { fetchPrompt } from '$lib/server/prompts.js';
import type { Tables } from '$lib/supabase';
import { DataSuggestionEditor } from './DataSuggestionEditor';

const systemPrompt = await fetchPrompt('IJlkTz-r', '639');

export async function generateDataEditors(
	prompt: Tables<'prompts'>,
	instances: string[],
	llm: LLM
): Promise<DataSuggestionEditor[]> {
	const res = await llm.generate(
		[
			{
				role: 'system',
				content: systemPrompt
			},
			{
				role: 'user',
				content: `
            Prompt: ${prompt.prompt}
            Test Cases:
            ${instances
							.sort(() => 0.5 - Math.random())
							.slice(0, 20)
							.join('\n')}
            `
			}
		],
		{ json: true }
	);
	const jsonOutput: string[] = JSON.parse(res || "{'output': []}")['output'];

	return jsonOutput.map((suggestion) => new DataSuggestionEditor(suggestion.toLowerCase()));
}
