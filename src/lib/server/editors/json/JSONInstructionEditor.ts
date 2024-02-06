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

	async filter(prompt: Tables<'prompts'>): Promise<boolean> {
		if (prompt.responseFormat !== 'json') {
			return false;
		}

		if (prompt.prompt.toLowerCase().includes('json')) {
			return false;
		}

		return true;
	}

	async apply(prompt: Tables<'prompts'>, llm: LLM): Promise<string> {
		const res = await llm.generate([
			{
				role: 'system',
				content:
					'You are an AI assistant that rewrites prompts given the specified criteria. Only return the new prompt.'
			},
			{
				role: 'user',
				content: `Rewrite the prompt so that it is clear that the model output should be in JSON format.\n\nprompt:\n${prompt.prompt}`
			}
		]);

		return res || prompt.prompt;
	}
}
