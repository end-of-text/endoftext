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
			return true;
		}

		if (prompt.prompt.toLowerCase().includes('json')) {
			return true;
		}

		return false;
	}

	async apply(prompt: Tables<'prompts'>, llm: LLM): Promise<string> {
		const res = await llm.generate([
			{
				role: 'system',
				content: `You are an AI assistant that rewrites prompts. Your task it to change a user-specified prompt to a large language model so that the model knows the output should be in JSON format. For example, by appending "Answer in JSON format." to the prompt.

				You do not modify the prompt in any other way. Specifically the general instruction AND formatting of the propmt should not be changed.

				You only return the new prompt in plain text.`
			},
			{
				role: 'user',
				content: prompt.prompt
			}
		]);

		return res || prompt.prompt;
	}
}
