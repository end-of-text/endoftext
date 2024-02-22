<script lang="ts">
	import type { Tables } from '$lib/supabase';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import PromptOptions from '../options/PromptOptions.svelte';
	import PromptEditor from './PromptEditor.svelte';
	import PromptSuggestions from './PromptSuggestions.svelte';

	let {
		prompt,
		suggestionApplied,
		userStatus,
		showOptions,
		editedPrompt,
		hoveredSuggestion,
		projectId,
		gettingSuggestions,
		suggestions,
		setPromptMaximized,
		editPrompt,
		setPrompt,
		loadPrompt
	} = $props<{
		prompt: Tables<'prompts'>;
		suggestionApplied: number;
		userStatus: string;
		showOptions: boolean;
		editedPrompt: Tables<'prompts'>;
		hoveredSuggestion: Tables<'suggestions'> | null;
		projectId: string | undefined;
		gettingSuggestions: boolean;
		suggestions: Tables<'suggestions'>[] | undefined;
		setPromptMaximized: (maximized: boolean) => void;
		editPrompt: (newPrompt: Tables<'prompts'>, suggestionId: number) => void;
		setPrompt: () => void;
		loadPrompt: (id: string | null) => void;
	}>();
</script>

<div class="flex h-full w-[450px] shrink-0 flex-col border-r px-6 py-4">
	<div class="mb-2 flex items-end justify-between">
		<h1>Prompt</h1>
		<button
			class="flex items-center gap-1 opacity-40 transition-all hover:opacity-100"
			onclick={() => (showOptions = !showOptions)}
		>
			<span class="text-black">Model Options</span>
			{#if showOptions}
				<ChevronUp class="h-5 w-5" />
			{:else}
				<ChevronDown class="h-5 w-5" />
			{/if}
		</button>
	</div>
	{#if showOptions}
		<PromptOptions bind:prompt={editedPrompt} {userStatus} />
	{/if}
	<div class="flex max-h-[50%] min-h-min flex-col pt-2">
		<PromptEditor
			{prompt}
			{hoveredSuggestion}
			{setPrompt}
			bind:suggestionApplied
			bind:editedPrompt
			{setPromptMaximized}
			{loadPrompt}
		/>
	</div>
	{#if projectId}
		<PromptSuggestions
			{prompt}
			{editedPrompt}
			{editPrompt}
			bind:gettingSuggestions
			bind:suggestions
			{suggestionApplied}
			setHoveredSuggestion={(suggestion) => (hoveredSuggestion = suggestion)}
		/>
	{/if}
</div>
