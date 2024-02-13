<script lang="ts">
	import { getSuggestions } from '$lib/api';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { RefreshCw } from 'lucide-svelte';
	import { untrack } from 'svelte';
	import PromptSuggestion from './PromptSuggestion.svelte';

	let { prompt, editPrompt } = $props<{
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

<div class="my-4 flex flex-col gap-2">
	<div class="mb-3 flex items-center">
		<h2>Suggestions</h2>
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
				<RefreshCw
					class="h-5 w-5 cursor-pointer transition-all duration-500 hover:rotate-180 hover:text-blue-500"
				/>
			{/if}
		</button>
	</div>
	<div class="flex flex-col gap-4 overflow-auto">
		{#await suggestionsRequest}
			<Spinner />
		{:then suggestions}
			{#if suggestions === undefined || suggestions.length === 0}
				No suggestions
			{:else}
				{#each suggestions as suggestion (suggestion.id)}
					<PromptSuggestion {prompt} {suggestion} {editPrompt} />
				{/each}
			{/if}
		{/await}
	</div>
</div>
