import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { fetchPrompt } from '../editors';
import { DataSuggestionEditor } from './DataSuggestionEditor';

export async function generateDataEditors(
	prompt: Tables<'prompts'>,
	instances: string[],
	llm: LLM
): Promise<DataSuggestionEditor[]> {
	const systemPrompt = await fetchPrompt('IJlkTz-r', '639');
	const res = await llm.generate([
		{
			role: 'system',
			content: await systemPrompt.text()
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
	]);
	const jsonOutput: string[] = JSON.parse(res || "{'output': []}")['output'];

	return jsonOutput.map((suggestion) => new DataSuggestionEditor(suggestion.toLowerCase()));
}
