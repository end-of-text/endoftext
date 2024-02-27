import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';

export class DataSuggestionEditor extends PromptEditor {
	constructor(suggestion: string) {
		super(
			'DataSuggestion',
			'Generate Test Cases',
			'Generate new test cases for the following category: ' + suggestion,
			EditorType.DATA
		);
	}

	async canBeApplied(prompt: Tables<'prompts'>, llm: LLM) {
		return [];
	}

	async rewritePrompt(
		prompt: Tables<'prompts'>,
		targetSpans: number[][],
		llm: LLM
	): Promise<Tables<'prompts'>> {
		return prompt;
	}
}
