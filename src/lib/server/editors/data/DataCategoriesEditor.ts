import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';

export class DataCategoriesEditor extends PromptEditor {
	constructor() {
		super(
			'DataCategories',
			'Generate New Test Cases',
			'Generate new test cases to identify prompt failures.',
			EditorType.DATA
		);
	}

	async canBeApplied(prompt: Tables<'prompts'>, llm: LLM) {}

	async rewritePrompt(
		prompt: Tables<'prompts'>,
		targetSpans: number[][],
		llm: LLM
	): Promise<Tables<'prompts'>> {}
}
