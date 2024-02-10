<script lang="ts">
	import { updatePrompt } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import PromptOptions from '../options/PromptOptions.svelte';
	import PromptEditor from './PromptEditor.svelte';
	import PromptSuggestions from './PromptSuggestions.svelte';

	let { prompt, projectId } = $props<{
		prompt: Tables<'prompts'>;
		projectId: string;
	}>();

	let editedPrompt = $state({ ...prompt });
	let showOptions = $state(false);

	function editPrompt(suggestion: string) {
		editedPrompt.prompt = suggestion;
	}

	function setPrompt() {
		updatePrompt(editedPrompt).then((r) => {
			prompt = r;
			showOptions = false;
			editedPrompt = { ...prompt };
		});
	}
</script>

<div class="flex h-full w-[450px] shrink-0 flex-col border-r px-6 pt-4">
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
		<PromptOptions bind:prompt={editedPrompt} />
	{/if}
	<PromptEditor {prompt} {setPrompt} bind:editedPrompt />
	{#if projectId}
		<PromptSuggestions {prompt} {editPrompt} />
	{/if}
</div>
