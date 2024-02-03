<script lang="ts">
	import { acceptSuggestion, getSuggestions } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import Button from '../ui/Button.svelte';
	import Spinner from '../ui/Spinner.svelte';

	let { projectId, prompt, editedPrompt } = $props<{
		projectId: string;
		prompt: Tables<'prompts'>;
		editedPrompt: string;
	}>();

	let applyingSuggestion = $state(false);
	let suggestionsRequest = $derived(getSuggestions(prompt));

	async function accept(prompt: Tables<'prompts'>, suggestion: Tables<'suggestions'>) {
		applyingSuggestion = true;
		editedPrompt = await acceptSuggestion(prompt.prompt, suggestion, projectId);
		applyingSuggestion = false;
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
					<div class="flex flex-row items-center justify-between">
						<div>
							<p class="font-bold">
								{suggestion.name}
							</p>
							<p>
								{suggestion.description}
							</p>
						</div>
						{#if applyingSuggestion}
							<Spinner />
						{:else}
							<Button onclick={() => accept(prompt, suggestion)}>Apply</Button>
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	{/await}
</div>
