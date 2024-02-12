import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';
import { PromptEditor } from './editor';

export class OutputDescriptionEditor extends PromptEditor {
	constructor() {
		super(
			'OutputDescription',
			'Output Description',
			'Change the prompt so it specifies the desired output content.',
			EditorType.ENHANCEMENT
		);
	}

	async filter(prompt: Tables<'prompts'>, llm: LLM): Promise<boolean> {
		if (prompt.responseFormat !== 'text') {
			return false;
		}
		const systemPrompt = `### Task
You are an AI prompt writing critiquer. Your task is to determine if a prompt clearly specifies the desired output information. 

### Instructions
Check whether the prompt includes a detailed description of the desired information. This can be an example or a description of the desired output but it needs to clearly outline the information contained in the answer. If it does, return false.
   
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
			return false;
		}

		try {
			const resJSON = JSON.parse(res);
			return resJSON.output;
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
		}[]
	): Promise<string> {
		const filteredPredictions = instancePredictions.filter((i) => i.label !== '');
		if (filteredPredictions.length === 0) {
			return prompt.prompt;
		}
		const labels = filteredPredictions.map((i) => i.label).slice(0, 10);

		const res = await llm.generate([
			{
				role: 'system',
				content:
					'You are an AI assistant that rewrites prompts given the specified criteria. Only return the new prompt.'
			},
			{
				role: 'user',
				content: `Rewrite the prompt so that the model answers match the format of these example outputs:\n${labels.join('\n- ')}\n\nprompt:\n${prompt.prompt}`
			}
		]);

		return res || prompt.prompt;
	}
}
