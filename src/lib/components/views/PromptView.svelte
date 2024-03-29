<script lang="ts">
	import PromptOptions from '$lib/components/options/PromptOptions.svelte';
	import PromptEditor from '$lib/components/prompt/PromptEditor.svelte';
	import type { Tables } from '$lib/supabase';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import PromptSuggestions from '../prompt/PromptSuggestions.svelte';
	import ViewParent from './ViewParent.svelte';

	let {
		prompt,
		editedPrompt,
		userStatus,
		hoveredSuggestion,
		suggestionApplied,
		projectId,
		suggestions,
		onclose,
		setPrompt,
		editPrompt
	} = $props<{
		prompt: Tables<'prompts'>;
		editedPrompt: Tables<'prompts'>;
		userStatus: string;
		hoveredSuggestion: Tables<'suggestions'> | null;
		suggestionApplied: number;
		projectId: string | undefined;
		suggestions: Promise<Tables<'suggestions'>[] | undefined>;
		onclose: () => void;
		setPrompt: () => void;
		editPrompt: (newPrompt: Tables<'prompts'>, suggestionId: number) => void;
	}>();

	let showOptions = $state(false);
	let selectedSpan = $state<{ start: number; end: number } | undefined>(undefined);
</script>

<ViewParent {onclose}>
	<div class="flex h-full grow flex-col px-6 py-4">
		<div class="mb-2 flex items-end justify-between">
			<h1>Prompt</h1>
			<button
				class="flex items-center gap-1 text-gray-active transition-all hover:text-gray-hovered"
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
		<PromptEditor
			{prompt}
			{hoveredSuggestion}
			{suggestions}
			promptMaximized={true}
			setPrompt={() => {
				setPrompt();
				onclose();
			}}
			bind:suggestionApplied
			bind:editedPrompt
			bind:selectedSpan
		/>
	</div>
	<div class="flex h-full w-[450px] shrink-0 flex-col border-l px-6 py-4">
		{#if projectId}
			<PromptSuggestions
				{prompt}
				{editedPrompt}
				{suggestionApplied}
				bind:suggestions
				bind:selectedSpan
				{editPrompt}
				setHoveredSuggestion={(suggestion) => (hoveredSuggestion = suggestion)}
				toplevel={true}
			/>
		{/if}
	</div>
</ViewParent>
