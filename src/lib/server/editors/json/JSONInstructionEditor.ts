import type { LLM } from '$lib/server/llms/llm';
import { fetchPrompt } from '$lib/server/prompts.js';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';
import { PromptEditor } from '../editor';

const systemPrompt = await fetchPrompt('ln4JpF48', '671');

export class JSONInstructionEditor extends PromptEditor {
	constructor() {
		super(
			'JSON',
			'JSON',
			'When using JSON mode you must also tell the model explicitly to output JSON.',
			EditorType.ERROR
		);
	}

	async canBeApplied(prompt: Tables<'prompts'>) {
		if (prompt.responseFormat !== 'json') {
			return null;
		}

		if (prompt.prompt.toLowerCase().includes('json')) {
			return null;
		}

		return [];
	}

	async rewritePrompt(
		prompt: Tables<'prompts'>,
		targetSpans: number[][],
		llm: LLM
	): Promise<Tables<'prompts'>> {
		const res = await llm.generate([
			{
				role: 'system',
				content: await systemPrompt.text()
			},
			{
				role: 'user',
				content: prompt.prompt
			}
		]);

		return { ...prompt, prompt: res || prompt.prompt };
	}
}
