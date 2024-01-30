import type { SearchResult } from '$lib/types';

function createSelectedPrompt() {
	let prompt = $state<SearchResult | undefined>(undefined);

	return {
		get prompt() {
			return prompt;
		},
		set: (p: SearchResult) => (prompt = p)
	};
}
export const selectedPrompt = createSelectedPrompt();
