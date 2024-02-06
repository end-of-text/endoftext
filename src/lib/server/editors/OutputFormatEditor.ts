import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';
import { PromptEditor } from './editor';

export class OutputFormatEditor extends PromptEditor {
	constructor() {
		super(
			'OutputFormat',
			'Output Format',
			'Change the prompt so model outputs follow the label structure.',
			EditorType.ERROR
		);
	}

	async filter(
		prompt: Tables<'prompts'>,
		llm: LLM,
		instancePredictions: {
			id: number;
			input: string;
			label: string;
			predictions: { prediction: string }[];
		}[]
	): Promise<boolean> {
		const filteredPredictions = instancePredictions.filter((i) => i.label !== '');
		if (filteredPredictions.length === 0) {
			return false;
		}
		const labels = filteredPredictions.map((i) => i.label).slice(0, 10);

		const res = await llm.generate(
			[
				{
					role: 'system',
					content:
						'You are an AI prompt writing critiquer. Given the following prompt, you return JSON with the key `output` that is either true if the prompt matches the user description or false otherwise.'
				},
				{
					role: 'user',
					content:
						`Is there a pattern in the desired output that is not yet in the prompt?\n\noutput examples:${labels.join('\n- ')}\n\nprompt:\n` +
						prompt.prompt
				}
			],
			{ json: true }
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
