import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType, PromptEditor } from './editor';

export class JSONEditor extends PromptEditor {
	constructor() {
		super(
			'JSON',
			'JSON',
			'Include a description that the user wants the output to be in JSON format.',
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
