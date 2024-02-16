<script lang="ts">
	import type { Tables } from '$lib/supabase';
	import type { Snippet } from 'svelte';
	import PromptSuggestions from './PromptSuggestions.svelte';

	let { prompt, projectId, setHoveredSuggestion, setSuggestionApplied, children } = $props<{
		prompt: Tables<'prompts'>;
		projectId: string;
		userStatus: string;
		setHoveredSuggestion: (suggestion: Tables<'suggestions'> | null) => void;
		setSuggestionApplied: (applied: boolean) => void;
		children?: Snippet;
	}>();

	let editedPrompt = $state({ ...prompt });

	function editPrompt(suggestion: string) {
		setSuggestionApplied(true);
		editedPrompt.prompt = suggestion;
	}
</script>

<div
	class="flex h-full w-[450px] shrink-0 flex-col {children === undefined
		? 'border-l'
		: 'border-r'} px-6 py-4"
>
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
