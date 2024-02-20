import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType, RequiredInputType } from '$lib/types';
import { PromptEditor } from './editor';

export class OutputDescriptionEditor extends PromptEditor {
	constructor() {
		super(
			'OutputDescription',
			'Output Description',
			'Change the prompt so it specifies the desired output content.',
			EditorType.ENHANCEMENT,
			RequiredInputType.TEXT
		);
	}

	async canBeApplied(prompt: Tables<'prompts'>, llm: LLM) {
		if (prompt.responseFormat !== 'text') {
			return null;
		}
		const systemPrompt = `### Task
You are an AI prompt writing critiquer. Your task is to determine if a prompt clearly specifies the desired output information. 

### Instructions
Check whether the prompt includes a detailed description of the desired information. This can be an example or a description of the desired output but it needs to clearly outline the information contained in the answer. If it does, return true.
   
### Output
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
			const resJSON = JSON.parse(res);
			return resJSON.output ? [] : null;
		} catch (e) {
			return null;
		}
	}

	async rewritePrompt(
		prompt: Tables<'prompts'>,
		targetSpans: number[][],
		llm: LLM,
		instancePredictions: {
			id: number;
			input: string;
			label: string;
			predictions: { prediction: string }[];
		}[],
		input: string | unknown
	): Promise<Tables<'prompts'>> {
		const systemPrompt = `You are an AI assistant that rewrites prompts to include a description of the desired output. Users provide a prompt and a description of the desired output. Your task is to append the desired output description to the prompt.

### Instructions
* You do not modify the prompt in any other way. Specifically the general instruction AND formatting of the propmt should not be changed. 
* Make sure the description is added somewhere towards the end of the prompt.
* Only return the new prompt in plain text without any other information or formatting.`;
		const res = await llm.generate([
			{
				role: 'system',
				content: systemPrompt
			},
			{
				role: 'user',
				content: `prompt:\n${prompt.prompt}\n\nOutput description:\n${input}\n\nmodified prompt:`
			}
		]);

		return { ...prompt, prompt: res || prompt.prompt };
	}
}
