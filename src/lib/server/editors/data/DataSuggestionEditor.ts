import { PromptEditor } from '$lib/server/editors/editor';
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

	async canBeApplied() {
		return [];
	}

	async rewritePrompt(prompt: Tables<'prompts'>): Promise<Tables<'prompts'>> {
		return prompt;
	}
}
