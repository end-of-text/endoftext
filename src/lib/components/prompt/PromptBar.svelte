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

<div class="mb-2 flex items-center justify-between">
	<h1>Prompt</h1>
</div>
<PromptEditor {prompt} {setPrompt} bind:showOptions bind:editedPrompt />
{#if projectId}
	<PromptSuggestions {prompt} {editPrompt} />
{/if}
