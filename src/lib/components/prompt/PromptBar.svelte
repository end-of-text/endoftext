<script lang="ts">
	import type { Tables } from '$lib/supabase';
	import PromptEditor from './PromptEditor.svelte';
	import PromptSuggestions from './PromptSuggestions.svelte';

	let { prompt, projectId } = $props<{
		prompt: Tables<'prompts'>;
		projectId: string;
	}>();

	let editedPrompt = $state(prompt.prompt);

	function editPrompt(suggestion: string) {
		editedPrompt = suggestion;
	}
</script>

<div class="w-[450px] shrink-0 p-2 shadow">
	{#if prompt}
		<h1>Prompt</h1>
		<PromptEditor bind:prompt bind:editedPrompt />
		{#if projectId}
			<PromptSuggestions {projectId} {prompt} {editPrompt} />
		{/if}
	{/if}
</div>
