import { ENDOFTEXT_API_KEY } from '$env/static/private';
import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';
import { PromptEditor } from '../editor';

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
		const systemPrompt = await fetch('https://app.endoftext.app/api/serve/project/ln4JpF48/671', {
			headers: {
				'x-api-key': ENDOFTEXT_API_KEY
			}
		});
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
