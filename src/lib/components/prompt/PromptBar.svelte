<script lang="ts">
	import { updatePrompt } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import PromptEditor from './PromptEditor.svelte';
	import PromptSuggestions from './PromptSuggestions.svelte';

	let { prompt, projectId } = $props<{
		prompt: Tables<'prompts'>;
		projectId: string;
	}>();

	let editedPrompt = $state({ ...prompt });

	function editPrompt(suggestion: string) {
		editedPrompt.prompt = suggestion;
	}

	function setPrompt() {
		updatePrompt(editedPrompt).then((r) => {
			prompt = r;
			editedPrompt = { ...prompt };
		});
	}
</script>

<div class="h-full w-[450px] shrink-0 p-2 shadow">
	<h1>Prompt</h1>
	<PromptEditor {prompt} {setPrompt} bind:editedPrompt />
	{#if projectId}
		<PromptSuggestions {projectId} {prompt} {editPrompt} />
	{/if}
</div>
