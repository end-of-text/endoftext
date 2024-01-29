<script lang="ts">
	import { selectedPrompt } from '$lib/stores';
	import type { Prompt } from '$lib/types';

	let { prompt } = $props<{ prompt: Prompt }>();
</script>

<button class="border p-2 rounded" on:click={() => selectedPrompt.set(prompt)}>
	<p class="text-start">{prompt.text}</p>
</button>
