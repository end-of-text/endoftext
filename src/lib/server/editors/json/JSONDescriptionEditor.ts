import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType, RequiredInputType } from '$lib/types';
import { PromptEditor } from '../editor';

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

		const systemPrompt = `### Role
You are an AI prompting expert. For a prompt that the user provides you, you evaluate whether that prompt specifies the desired JSON format. If the prompt does not say what the output format should look like, return true. Otherwise return false. 

## Examples
Input: return JSON
Output: true
Input: give JSON outputs
Output: false
Input: return JSON with the key output and value
Output: false
		
### Output Format
Return the output in JSON with the key "output" that is either true or false.`;

		const res = await llm.generate(
			[
				{
					role: 'system',
					content: systemPrompt
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
		const systemPrompt = `You are an AI assistant that rewrites prompts to include a description of the desired JSON format. Users provide a prompt and the desired JSON format. Your task is to append the desired format to the prompt.

### Instructions
* You do not modify the prompt in any other way. Specifically the general instruction AND formatting of the prompt should not be changed. 
* Make sure the desired format is added somewhere towards the end of the prompt.
* Only return the new prompt in plain text without any other information or formatting.`;
		const res = await llm.generate([
			{
				role: 'system',
				content: systemPrompt
			},
			{
				role: 'user',
				content: `prompt:\n${prompt.prompt}\n\nDesired JSON format:\n${input}\n\nmodified prompt:`
			}
		]);

		return { ...prompt, prompt: res || prompt.prompt };
	}
}
