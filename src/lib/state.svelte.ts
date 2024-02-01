import type { Prompt } from '$lib/types';

function createSelectedPrompt() {
	let prompt = $state<Prompt | undefined>(undefined);

	return {
		get prompt() {
			return prompt;
		},
		set: (p: Prompt) => (prompt = p)
	};
}
export const selectedPrompt = createSelectedPrompt();
