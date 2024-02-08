<script lang="ts">
	import { updatePrompt } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import { Check, Copy } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import PromptEditor from './PromptEditor.svelte';
	import PromptSuggestions from './PromptSuggestions.svelte';

	let { prompt, projectId } = $props<{
		prompt: Tables<'prompts'>;
		projectId: string;
	}>();

	let editedPrompt = $state({ ...prompt });
	let showOptions = $state(false);
	let copied = $state(false);

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

	function copyPrompt() {
		navigator.clipboard.writeText(prompt.prompt);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 3000);
	}
</script>

<div class="mb-2 flex items-center justify-between">
	<h1>Prompt</h1>
	<button onclick={copyPrompt} class="p-1 {copied ? 'text-emerald-600' : ''}">
		{#if copied}
			<span class="flex items-center gap-2" in:fade><Check /> Copied!</span>
		{:else}
			<span class="flex items-center gap-2 text-gray-500 hover:text-gray-950" in:fade
				><Copy /> Copy</span
			>
		{/if}
	</button>
</div>
<PromptEditor {prompt} {setPrompt} bind:showOptions bind:editedPrompt />
{#if projectId}
	<PromptSuggestions {prompt} {editPrompt} />
{/if}
