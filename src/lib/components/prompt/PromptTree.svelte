<script lang="ts">
	import { selectedPrompt } from '$lib/state.svelte';

	let { prompts } = $props<{ prompts?: Tables<'prompts'>[] }>();
</script>

<h2>all prompts</h2>
{#if prompts}
	<div class="flex flex-wrap gap-2">
		{#each prompts as prompt, index (prompt.id)}
			<button
				class="rounded border px-2 py-1 {selectedPrompt.prompt?.id === prompt.id
					? 'bg-slate-200'
					: 'bg-slate-50'} transition hover:bg-slate-300"
				onclick={() => selectedPrompt.set(prompt)}>{prompt.prompt}</button
			>
			{#if index < prompts.length - 1}
				<span class="mx-2">→</span>
			{/if}
		{/each}
	</div>
{/if}
