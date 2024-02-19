<script lang="ts">
	import { getSuggestions } from '$lib/api';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { RefreshCw } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import PromptSuggestion from './PromptSuggestion.svelte';

	let {
		prompt,
		setHoveredSuggestion,
		editPrompt,
		gettingSuggestions,
		suggestions,
		suggestionApplied,
		toplevel = false
	} = $props<{
		prompt: Tables<'prompts'>;
		setHoveredSuggestion: (suggestion: Tables<'suggestions'> | null) => void;
		editPrompt: (changedPrompt: string, suggestionId: number) => void;
		gettingSuggestions: boolean;
		suggestions: Tables<'suggestions'>[] | undefined;
		suggestionApplied: number;
		toplevel?: boolean;
	}>();
</script>

<div
	class="{!toplevel ? 'my-4' : ''} flex min-h-0 grow flex-col gap-2"
	transition:fade={{ duration: 200 }}
>
	<div class="mb-3 flex items-center">
		{#if toplevel}
			<h1>Suggestions</h1>
		{:else}
			<h2>Suggestions</h2>
		{/if}
		<button
			class="pl-4"
			onclick={() => {
				gettingSuggestions = true;
				suggestions = [];
				getSuggestions(prompt, true).then((r) => {
					suggestions = r;
					gettingSuggestions = false;
				});
			}}
		>
			{#if gettingSuggestions}
				<Spinner />
			{:else}
				<RefreshCw
					class="h-5 w-5 cursor-pointer transition-all duration-500 hover:rotate-180 hover:text-blue-600"
				/>
			{/if}
		</button>
	</div>
	<div class="flex flex-col gap-4 overflow-auto">
		{#if gettingSuggestions}{:else if suggestions === undefined || suggestions.length === 0}
			No suggestions
		{:else if suggestionApplied > -1}
			{@const suggestion = suggestions.find((s) => s.id === suggestionApplied)}
			{#if suggestion !== undefined}
				<PromptSuggestion {prompt} {suggestion} {editPrompt} applied />
			{/if}
		{:else}
			{#each suggestions as suggestion (suggestion.id)}
				<div
					onmouseover={() => setHoveredSuggestion(suggestion)}
					onmouseleave={() => setHoveredSuggestion(null)}
					onfocus={() => setHoveredSuggestion(suggestion)}
					onblur={() => setHoveredSuggestion(null)}
					role="button"
					tabindex="0"
				>
					<PromptSuggestion {prompt} {suggestion} {editPrompt} />
				</div>
			{/each}
		{/if}
	</div>
</div>
