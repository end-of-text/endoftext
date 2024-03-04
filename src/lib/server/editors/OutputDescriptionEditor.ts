import type { LLM } from '$lib/server/llms/llm';
import { fetchPrompt } from '$lib/server/prompts.js';
import type { Tables } from '$lib/supabase';
import { EditorType, RequiredInputType } from '$lib/types';
import { PromptEditor } from './editor';

const filterPrompt = await fetchPrompt('sxG3k46e', '614');
const applyPrompt = await fetchPrompt('sU9ifhBZ', '615');

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
		const res = await llm.generate(
			[
				{
					role: 'system',
					content: await filterPrompt.text()
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
		const res = await llm.generate([
			{
				role: 'system',
				content: await applyPrompt.text()
			},
			{
				role: 'user',
				content: `prompt:\n${prompt.prompt}\n\nOutput description:\n${input}\n\nmodified prompt:`
			}
		]);

		return { ...prompt, prompt: res || prompt.prompt };
	}
}
