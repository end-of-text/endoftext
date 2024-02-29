import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType, RequiredInputType } from '$lib/types';
import { PromptEditor } from '../editor';

const filterPrompt = `
You are an AI prompting expert. 
For a prompt that the user provides you, you evaluate whether that prompt specifies the desired JSON format. 
If the prompt states the output format, return false. 
Otherwise return true. 

### Examples
Input: return JSON
Output: true
Input: Answer in JSON format
Output: true
Input: give JSON outputs
Output: true
Input: JSON with key result
Output: false
Input: return JSON with the key output and value
Output: false
		
### Output Format
Return the output in JSON with the key "output" that is either true or false.
`;

const rewritePrompt = `
You are an AI assistant that rewrites prompts to include a description of the desired JSON format. Users provide a prompt and the desired JSON format. 
Your task is to append the desired format to the prompt.

### Instructions
* You do not modify the prompt in any other way. Specifically the general instruction AND formatting of the prompt should not be changed. 
* Make sure the desired format is added somewhere towards the end of the prompt.
* Only return the new prompt in plain text without any other information or formatting.`;

export class JSONDescriptionEditor extends PromptEditor {
	constructor() {
		super(
			'JSON Description',
			'JSON Description',
			'Include a description of the desired JSON format. This can be an example or a specification.',
			EditorType.ENHANCEMENT,
			RequiredInputType.TEXT
		);
	}

	async canBeApplied(prompt: Tables<'prompts'>, llm: LLM) {
		if (!prompt.prompt.toLowerCase().includes('json')) {
			return null;
		}

		const res = await llm.generate(
			[
				{
					role: 'system',
					content: filterPrompt
				},
				{
					role: 'user',
					content: prompt.prompt
				}
			],
			{ json: true, temperature: 0 }
		);

		if (!res) {
			return null;
		}

		try {
			return JSON.parse(res).output ? [] : null;
		} catch (e) {
			return null;
		}
	}

	async rewritePrompt(
		prompt: Tables<'prompts'>,
		target_spans: number[][],
		llm: LLM,
		instancePredictions: {
			id: number;
			input: string;
			label: string;
			predictions: { prediction: string }[];
		}[],
		input: string | unknown
	): Promise<Tables<'prompts'>> {
		const res = await llm.generate([
			{
				role: 'system',
				content: rewritePrompt
			},
			{
				role: 'user',
				content: `Prompt:\n${prompt.prompt}\n\nDesired JSON format:\n${input}`
			}
		]);

		return { ...prompt, prompt: res || prompt.prompt };
	}
}
