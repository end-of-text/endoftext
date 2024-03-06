<script lang="ts">
	import type { Tables } from '$lib/supabase';
	import { filterSuggestions } from '$lib/util';
	import * as diff from 'diff';
	import { fade } from 'svelte/transition';

	let {
		prompt,
		hoveredSuggestion,
		suggestionApplied,
		editedPrompt,
		selectedSpan,
		suggestions,
		promptWasEdited
	} = $props<{
		prompt: Tables<'prompts'>;
		hoveredSuggestion: Tables<'suggestions'> | null;
		suggestionApplied: number;
		editedPrompt: Tables<'prompts'>;
		selectedSpan: { start: number; end: number } | undefined;
		suggestions: Promise<Tables<'suggestions'>[] | undefined>;
		promptWasEdited: boolean;
	}>();

	function combineSpans(suggestions: Tables<'suggestions'>[]): number[][] {
		// Combine overlapping spans.
		const allSpans: number[][] = suggestions
			.flatMap((suggestion) => suggestion.target_spans || [])
			.sort((a, b) => a[0] - b[0]);

		const combinedSpans: number[][] = [];
		if (allSpans.length === 0) return combinedSpans;
		let currentSpan = allSpans[0];

		for (let i = 1; i < allSpans.length; i++) {
			if (allSpans[i][0] <= currentSpan[1]) {
				currentSpan[1] = Math.max(currentSpan[1], allSpans[i][1]);
			} else {
				combinedSpans.push(currentSpan);
				currentSpan = allSpans[i];
			}
		}

		combinedSpans.push(currentSpan);
		return combinedSpans;
	}
</script>

{#if selectedSpan}
	<div
		class="user-select-none pointer-events-none absolute left-0 top-0 h-full min-h-24 w-full whitespace-pre-line py-2 pl-2 pr-6 text-[0px] text-transparent"
		aria-hidden="true"
		transition:fade={{ duration: 200 }}
	>
		<span class="text-sm">
			{editedPrompt.prompt.slice(0, selectedSpan.start)}
		</span>
		<span class="bg-blue-600 bg-opacity-20 text-sm">
			{editedPrompt.prompt.slice(selectedSpan.start, selectedSpan.end)}
		</span>
		<span class="text-sm">
			{editedPrompt.prompt.slice(selectedSpan.end)}
		</span>
	</div>
{/if}
<div
	class="pointer-events-none absolute left-0 top-0 h-full min-h-24 w-full select-none whitespace-pre-line py-2 pl-2 pr-6 text-sm text-transparent"
	aria-hidden="true"
	transition:fade={{ duration: 200 }}
>
	{#if suggestionApplied !== -1}
		{#each diff.diffWords(prompt.prompt, editedPrompt.prompt) as part}
			{#if part.added}
				<span class="bg-blue-600 opacity-30">{part.value}</span>
			{:else if !part.removed}
				{part.value}
			{/if}
		{/each}
	{:else if hoveredSuggestion && hoveredSuggestion.target_spans && !promptWasEdited}
		{#each hoveredSuggestion.target_spans as span, index}
			{prompt.prompt.slice(index === 0 ? 0 : hoveredSuggestion.target_spans[index - 1][1], span[0])}
			<span class="underline decoration-red-500 decoration-2">
				{prompt.prompt.slice(span[0], span[1])}
			</span>
			{#if index === hoveredSuggestion.target_spans.length - 1}
				<span>
					{prompt.prompt.slice(span[1])}
				</span>
			{/if}
		{/each}
	{:else if !promptWasEdited}
		{#await suggestions then suggestions}
			{@const filteredSuggestions = filterSuggestions(suggestions, selectedSpan)}
			{#if filteredSuggestions && filteredSuggestions.length > 0}
				{@const combinedSpans = combineSpans(filteredSuggestions)}
				{#if combinedSpans.length > 0}
					{prompt.prompt.slice(0, combinedSpans[0][0])}
					{#each combinedSpans as span, index}
						<span
							class="pointer-events-auto cursor-pointer underline decoration-red-500 decoration-2"
							onclick={() => (selectedSpan = { start: span[0], end: span[1] })}
							role="button"
							tabindex="0"
							onkeydown={() => {}}
						>
							{prompt.prompt.slice(span[0], span[1])}
						</span>
						{#if index === combinedSpans.length - 1}
							{prompt.prompt.slice(span[1])}
						{:else}
							{prompt.prompt.slice(span[1], combinedSpans[index + 1][0])}
						{/if}
					{/each}
				{/if}
			{/if}
		{/await}
	{/if}
</div>
