<script lang="ts">
	import PromptView from '$lib/components/prompts/PromptView.svelte';
	import type { Prompt } from '$lib/types';

	let { prompts } = $props<{ prompts: Prompt[] }>();
</script>

<div class="flex flex-col w-96 shrink-0 shadow-lg p-4">
	<div class="flex gap-10 mb-5 items-center">
		<p class="text-xl">Prompts</p>
	</div>
	<div class="flex gap-2 flex-col">
		{#each prompts as prompt}
			<PromptView {prompt} />
		{/each}
	</div>
</div>
