import type { LLM } from '$lib/server/llms/llm';
import { fetchPrompt } from '$lib/server/prompts.js';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';
import { PromptEditor } from '../editor';

const filterPrompt = await fetchPrompt('94IomCIj', '688');
const rewritePrompt = await fetchPrompt('w-l_rMSk', '640');

export class JSONOutputEditor extends PromptEditor {
	constructor() {
		super(
			'JSON Output',
			'JSON Output',
			'Your are requesting structured information from the model. Consider using JSON mode.',
			EditorType.ENHANCEMENT
		);
	}

	async canBeApplied(prompt: Tables<'prompts'>, llm: LLM) {
		if (prompt.responseFormat === 'json') {
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
		llm: LLM
	): Promise<Tables<'prompts'>> {
		const res = await llm.generate([
			{
				role: 'system',
				content: rewritePrompt
			},
			{
				role: 'user',
				content: prompt.prompt
			}
		]);

		return { ...prompt, responseFormat: 'json', prompt: res || prompt.prompt };
	}
}
