import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType, RequiredInputType } from '$lib/types';
import { PromptEditor } from '../editor';

export class ConvertToJSONEditor extends PromptEditor {
	constructor() {
		super(
			'Output JSON',
			'Output JSON',
			'Your desired output seems to be very structured. Consider converting it to JSON.',
			EditorType.ENHANCEMENT,
			RequiredInputType.TEXT
		);
	}

	async canBeApplied(prompt: Tables<'prompts'>, llm: LLM) {
		if (prompt.responseFormat === 'json') {
			return null;
		}

		const systemPrompt = `### Role
You are an AI prompting expert. For a prompt that the user provides you, you evaluate whether that prompt should use JSON as its desired output format.
		
### Instruction
Go through the following steps one by one. If either applies, return true.
1. Check whether the prompt includes a detailed description of the desired information. This can be an example or a description of the desired output but it needs to clearly outline the information contained in the answer. If it does, continue to step 2. Otherwise, return true.
2. If the desired output is very structured and could be represented as JSON, return false.
		
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
				content: `prompt:\n${prompt.prompt}\n\nAnswer with JSON. Desired JSON format:\n${input}\n\nmodified prompt:`
			}
		]);

		return { ...prompt, responseFormat: 'json', prompt: res || prompt.prompt };
	}
}
