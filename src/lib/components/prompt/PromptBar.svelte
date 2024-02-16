<script lang="ts">
	import type { Tables } from '$lib/supabase';
	import type { Snippet } from 'svelte';
	import PromptSuggestions from './PromptSuggestions.svelte';

	let { prompt, projectId, hoveredSuggestion, suggestionApplied, children } = $props<{
		prompt: Tables<'prompts'>;
		projectId: string;
		userStatus: string;
		hoveredSuggestion: Tables<'suggestions'> | null;
		suggestionApplied: boolean;
		children?: Snippet;
	}>();

	let editedPrompt = $state({ ...prompt });

	function editPrompt(suggestion: string) {
		suggestionApplied = true;
		editedPrompt.prompt = suggestion;
	}

	function setHoveredSuggestion(suggestion: Tables<'suggestions'> | null) {
		hoveredSuggestion = suggestion;
	}
</script>

<div class="flex h-full w-[450px] shrink-0 flex-col border-r px-6 py-4">
	{#if children}
		{@render children()}
	{/if}
	{#if projectId}
		<PromptSuggestions
			{prompt}
			{editPrompt}
			{setHoveredSuggestion}
			toplevel={children === undefined}
		/>
	{/if}
</div>
