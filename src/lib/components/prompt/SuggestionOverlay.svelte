<script lang="ts">
	import type { Tables } from '$lib/supabase';
	import * as diff from 'diff';
	import { fade } from 'svelte/transition';

	let { prompt, hoveredSuggestion, suggestionApplied, editedPrompt, selectedSpan } = $props<{
		prompt: Tables<'prompts'>;
		hoveredSuggestion: Tables<'suggestions'> | null;
		suggestionApplied: number;
		editedPrompt: Tables<'prompts'>;
		selectedSpan: { start: number; end: number } | undefined;
	}>();
</script>

<div
	class="user-select-none pointer-events-none absolute left-0 top-0 h-full min-h-24 w-full whitespace-pre-line py-2 pl-2 pr-6 text-sm text-transparent"
	aria-hidden="true"
	transition:fade={{ duration: 200 }}
>
	{#if suggestionApplied > -1}
		{#each diff.diffWords(prompt.prompt, editedPrompt.prompt) as part}
			{#if part.added}
				<span class="bg-blue-600 opacity-30">{part.value}</span>
			{:else if !part.removed}
				{part.value}
			{/if}
		{/each}
	{:else if hoveredSuggestion && hoveredSuggestion.target_spans}
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
	{:else if selectedSpan}
		{prompt.prompt.slice(0, selectedSpan.start)}
		<span class="underline decoration-blue-600 decoration-wavy decoration-2">
			{prompt.prompt.slice(selectedSpan.start, selectedSpan.end)}
		</span>
		{prompt.prompt.slice(selectedSpan.end)}
	{/if}
</div>
