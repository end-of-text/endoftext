<script lang="ts">
	import { getSuggestions } from '$lib/api';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { tooltip } from '$lib/tooltip.svelte';
	import { filterSuggestions } from '$lib/util';
	import { RefreshCw } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import PromptSuggestion from './PromptSuggestion.svelte';
	import RewriteBox from './RewriteBox.svelte';

	let {
		prompt,
		editedPrompt,
		setHoveredSuggestion,
		editPrompt,
		suggestions,
		suggestionApplied,
		selectedSpan,
		toplevel = false
	} = $props<{
		prompt: Tables<'prompts'>;
		editedPrompt: Tables<'prompts'>;
		setHoveredSuggestion: (suggestion: Tables<'suggestions'> | null) => void;
		editPrompt: (newPrompt: Tables<'prompts'>, suggestionId: number) => void;
		suggestions: Promise<Tables<'suggestions'>[] | undefined>;
		suggestionApplied: number;
		selectedSpan: { start: number; end: number } | undefined;
		toplevel?: boolean;
	}>();

	let promptWasEdited = $derived(
		JSON.stringify(prompt) === JSON.stringify(editedPrompt) ? false : true
	);

	async function dismissSuggestion(suggestion: Tables<'suggestions'>) {
		suggestions.then((localSuggestions) => {
			suggestions = new Promise((resolve) =>
				resolve(localSuggestions?.filter((s) => s.id !== suggestion.id))
			);
		});
		await fetch(`/api/editor/suggestions/dismiss`, {
			method: 'DELETE',
			body: JSON.stringify({
				suggestion
			})
		});
	}
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
		<button class="pl-4" onclick={() => (suggestions = getSuggestions(prompt))}>
			{#await suggestions}
				<Spinner />
			{:then}
				<RefreshCw
					class="h-5 w-5 cursor-pointer transition-all duration-500 hover:rotate-180 hover:text-blue-600"
				/>
			{/await}
		</button>
	</div>
	<div class="flex flex-col gap-4 overflow-auto">
		{#await suggestions then suggestions}
			{@const filteredSuggestions =
				promptWasEdited && selectedSpan !== undefined
					? []
					: filterSuggestions(suggestions, selectedSpan)}
			{#if filteredSuggestions === undefined || filteredSuggestions.length === 0}
				{#if selectedSpan === undefined}
					No suggestions
				{/if}
			{:else if suggestionApplied > -1}
				{@const suggestion = filteredSuggestions.find((s) => s.id === suggestionApplied)}
				{#if suggestion !== undefined}
					<PromptSuggestion
						bind:selectedSpan
						{prompt}
						{suggestion}
						{dismissSuggestion}
						{editPrompt}
						applied
					/>
				{/if}
				{#each filteredSuggestions.filter((s) => s.id !== suggestionApplied) as suggestion (suggestion.id)}
					<div
						use:tooltip={{
							text: 'To apply another suggestion, either save or revert the current changes.'
						}}
					>
						<PromptSuggestion
							bind:selectedSpan
							{prompt}
							{suggestion}
							{dismissSuggestion}
							{editPrompt}
							disabled
						/>
					</div>
				{/each}
			{:else if promptWasEdited}
				{#each filteredSuggestions as suggestion (suggestion.id)}
					<div
						use:tooltip={{
							text: 'To apply a suggestion, either save or revert the current changes.'
						}}
					>
						<PromptSuggestion
							bind:selectedSpan
							{prompt}
							{suggestion}
							{dismissSuggestion}
							{editPrompt}
							disabled
						/>
					</div>
				{/each}
			{:else}
				{#each filteredSuggestions as suggestion (suggestion.id)}
					<div
						onmouseover={() => setHoveredSuggestion(suggestion)}
						onmouseleave={() => setHoveredSuggestion(null)}
						onfocus={() => setHoveredSuggestion(suggestion)}
						onblur={() => setHoveredSuggestion(null)}
						role="button"
						tabindex="0"
						class="flex"
					>
						<PromptSuggestion
							bind:selectedSpan
							{prompt}
							{suggestion}
							{dismissSuggestion}
							{editPrompt}
						/>
					</div>
				{/each}
			{/if}
		{/await}
		{#if selectedSpan}
			<RewriteBox bind:selectedSpan {prompt} {editPrompt} />
		{/if}
	</div>
</div>
