import type { LLM } from '$lib/server/llms/llm';
import { fetchPrompt } from '$lib/server/prompts.js';
import type { Tables } from '$lib/supabase';
import { EditorType, RequiredInputType } from '$lib/types';
import { PromptEditor } from './editor';

const filterPrompt = await fetchPrompt('4GznJqeM', '789');
const applyPrompt = await fetchPrompt('iXgXi2Wk', '788');

export class MarkdownEditor extends PromptEditor {
	constructor() {
		super(
			'Markdown',
			'Markdown',
			'Structure your prompt using markdown.',
			EditorType.ENHANCEMENT,
			RequiredInputType.TEXT
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
				content: applyPrompt
			},
			{
				role: 'user',
				content: prompt.prompt
			}
		]);

		return { ...prompt, prompt: res || prompt.prompt };
	}
}
