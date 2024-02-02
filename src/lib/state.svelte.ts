import type { Tables } from './supabase';

function createSelectedPrompt() {
	let prompt = $state<Tables<'prompts'> | undefined>(undefined);

	return {
		get prompt() {
			return prompt;
		},
		set: (p: Tables<'prompts'> | undefined) => (prompt = p)
	};
}
export const selectedPrompt = createSelectedPrompt();
