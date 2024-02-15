<script lang="ts">
	import { updatePrompt } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import PromptOptions from '../options/PromptOptions.svelte';
	import PaywallPopup from '../popups/PaywallPopup.svelte';
	import PromptEditor from './PromptEditor.svelte';
	import PromptSuggestions from './PromptSuggestions.svelte';

	let { prompt, projectId, userStatus } = $props<{
		prompt: Tables<'prompts'>;
		projectId: string;
		userStatus: string;
	}>();

	let editedPrompt = $state({ ...prompt });
	let suggestionApplied = $state(false);
	let hoveredSuggestion: Tables<'suggestions'> | null = $state(null);
	let showOptions = $state(false);
	let showPaywall = $state(false);

	function editPrompt(suggestion: string) {
		suggestionApplied = true;
		editedPrompt.prompt = suggestion;
	}

	function setPrompt() {
		updatePrompt(editedPrompt).then((r) => {
			if (r === null) {
				showPaywall = true;
				return;
			}
			prompt = r;
			showOptions = false;
			suggestionApplied = false;
			editedPrompt = { ...prompt };
		});
	}

	function setHoveredSuggestion(suggestion: Tables<'suggestions'> | null) {
		hoveredSuggestion = suggestion;
	}
</script>

{#if showPaywall}
	<PaywallPopup
		onclose={() => (showPaywall = false)}
		message="You have reached your monthly limit of 100 prompts."
	/>
{/if}
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
	<PromptEditor {prompt} {hoveredSuggestion} {setPrompt} bind:suggestionApplied bind:editedPrompt />
	{#if projectId}
		<PromptSuggestions {prompt} {editPrompt} {setHoveredSuggestion} />
	{/if}
</div>
