<script lang="ts">
	import { acceptSuggestion, getSuggestions } from '$lib/api';
	import { selectedPrompt } from '$lib/state.svelte';
	import type { Tables } from '$lib/supabase';

	let { projectId } = $props<{ projectId: string }>();

	let suggestionsRequest = $derived(getSuggestions(selectedPrompt.prompt));

	function accept(prompt: Tables<'prompts'> | undefined, suggestion: Tables<'suggestions'>) {
		acceptSuggestion(prompt, suggestion, projectId);
	}
</script>

<div class="mt-4 flex flex-col gap-2">
	<h2>Suggestions</h2>
	{#await suggestionsRequest}
		Loading suggestions...
	{:then suggestions}
		{#if suggestions === undefined || suggestions.length === 0}
			No suggestions
		{:else}
			{#each suggestions as suggestion}
				<div class="flex flex-col rounded border p-2">
					<div class="flex flex-row justify-between">
						<span class="font-bold">
							{suggestion.name}
						</span>
						<button onclick={() => accept(selectedPrompt.prompt, suggestion)}>Apply</button>
					</div>
					{suggestion.description}
				</div>
			{/each}
		{/if}
	{/await}
</div>
