<script lang="ts">
	import { updatePrompt } from '$lib/api';
	import PromptOptions from '$lib/components/options/PromptOptions.svelte';
	import PromptBar from '$lib/components/prompt/PromptBar.svelte';
	import PromptEditor from '$lib/components/prompt/PromptEditor.svelte';
	import type { Tables } from '$lib/supabase';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import ViewParent from './ViewParent.svelte';

	let { prompt, userStatus, projectId, setShowPaywall, onclose } = $props<{
		prompt: Tables<'prompts'>;
		userStatus: string;
		projectId: string;
		setShowPaywall: (show: boolean) => void;
		onclose: () => void;
	}>();

	let showOptions = $state(false);
	let editedPrompt = $state({ ...prompt });
	let suggestionApplied = $state(false);
	let hoveredSuggestion: Tables<'suggestions'> | null = $state(null);

	function setPrompt() {
		updatePrompt(editedPrompt).then((r) => {
			if (r === null) {
				setShowPaywall(true);
				return;
			}
			prompt = r;
			showOptions = false;
			suggestionApplied = false;
			editedPrompt = { ...prompt };
		});
	}
</script>

<ViewParent {onclose}>
	<div class="flex h-full grow flex-col px-6 py-4">
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
		<PromptEditor
			{prompt}
			{hoveredSuggestion}
			{setPrompt}
			bind:suggestionApplied
			bind:editedPrompt
		/>
	</div>
	<PromptBar
		bind:prompt
		{projectId}
		{userStatus}
		setHoveredSuggestion={(suggestion) => (hoveredSuggestion = suggestion)}
		setSuggestionApplied={(applied) => (suggestionApplied = applied)}
	/>
</ViewParent>
