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

	async filter(prompt: Tables<'prompts'>, llm: LLM): Promise<boolean> {
		if (prompt.responseFormat !== 'json' || !prompt.prompt.toLowerCase().includes('json')) {
			return false;
		}

		const systemPrompt = `### Role
You are an AI prompting expert. For a prompt that the user provides you, you evaluate whether that prompt specifies the desired JSON format. All prompts you get are supposed to produce a JSON output.
		
### Instruction
Go through the following steps one by one. If either applies, return false.
1. The prompt includes an example output that outlines the desired JSON format.
2. The prompt contains a JSON specification that details the desired JSON format.
3. The prompt contains a textual explanation of how the JSON output should be structured.
		
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
			return false;
		}

		try {
			return JSON.parse(res).output;
		} catch (e) {
			return false;
		}
	}

	async apply(
		prompt: Tables<'prompts'>,
		llm: LLM,
		instancePredictions: {
			id: number;
			input: string;
			label: string;
			predictions: { prediction: string }[];
		}[],
		input: string | unknown
	): Promise<string> {
		const systemPrompt = `You are an AI assistant that rewrites prompts to include a description of the desired JSON format. Users provide a prompt and the desired JSON format. Your task is to append the desired format to the prompt.

### Instructions
* You do not modify the prompt in any other way. Specifically the general instruction AND formatting of the propmt should not be changed. 
* Make sure the desirer format is added somewhere towards the end of the prompt.
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

		return res || prompt.prompt;
	}
}
