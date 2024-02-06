<script lang="ts">
	import { getSuggestions } from '$lib/api';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { RefreshCw } from 'lucide-svelte';
	import { untrack } from 'svelte';
	import PromptSuggestion from './PromptSuggestion.svelte';

	let { projectId, prompt, editPrompt } = $props<{
		projectId: string;
		prompt: Tables<'prompts'>;
		editPrompt: (suggestion: string) => void;
	}>();

	let gettingSuggestions = $state(false);
	let suggestionsRequest: Tables<'suggestions'>[] | undefined = $state([]);

	$effect(() => {
		untrack(() => (gettingSuggestions = true));
		getSuggestions(prompt).then((r) => {
			untrack(() => {
				suggestionsRequest = r;
				gettingSuggestions = false;
			});
		});
	});
</script>

<div class="mt-4 flex flex-col gap-2">
	<div class="my-2 flex">
		<h2 class="mb-0">Suggestions</h2>
		<button
			class="pl-4"
			onclick={() => {
				gettingSuggestions = true;
				getSuggestions(prompt, true).then((r) => {
					suggestionsRequest = r;
					gettingSuggestions = false;
				});
			}}
		>
			{#if gettingSuggestions}
				<Spinner />
			{:else}
				<RefreshCw class="cursor-pointer transition hover:text-green-600" />
			{/if}
		</button>
	</div>
	{#await suggestionsRequest}
		<Spinner />
	{:then suggestions}
		{#if suggestions === undefined || suggestions.length === 0}
			No suggestions
		{:else}
			{#each suggestions as suggestion (suggestion.id)}
				<PromptSuggestion {projectId} {prompt} {editPrompt} {suggestion} />
			{/each}
		{/if}
	{/await}
</div>
