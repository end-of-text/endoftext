import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { DataSuggestionEditor } from './DataSuggestionEditor';

const DATA_PROMPT = `
You ideate potential types of data that a given prompt might fail for. You are given a prompt an existing test cases. Only return categories that ARE NOT present in the existing test cases.

### Examples
"""
Prompt: Extract the direct object form this text
Test Cases:
I am the king of the world.
Josephine went on a walk.
Alex ate the apple.
Output:
Longer sentences
No direct object
Sentences with direct objects
"""

### Instructions
Return JSON with the key output and an array of types of data.
`;

export async function generateDataEditors(
	prompt: Tables<'prompts'>,
	instances: string[],
	llm: LLM
): Promise<DataSuggestionEditor[]> {
	const res = await llm.generate([
		{
			role: 'system',
			content: DATA_PROMPT
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

	return jsonOutput.map((suggestion) => new DataSuggestionEditor(suggestion));
}
