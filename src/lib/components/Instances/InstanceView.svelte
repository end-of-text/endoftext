<script lang="ts">
	import { selectedPrompt } from '$lib/state.svelte';
	import type { Entry } from '$lib/types';

	let { entry } = $props<{ entry: Entry }>();

	let output = $derived(selectedPrompt.prompt?.outputs[entry.id] ?? undefined);
</script>

<div class="relative break-words rounded border">
	<div class="p-4">
		{#if entry.question !== undefined}
			<div class="flex flex-row">
				<p class="text-grey whitespace-pre-wrap">
					{entry.question}
				</p>
			</div>
		{/if}
		{#if entry.answer !== undefined}
			<div class="mt-2 text-sm text-gray-400">label</div>
			<div class="flex flex-row">
				<p class="text-grey whitespace-pre-wrap">
					{entry.answer}
				</p>
			</div>
		{/if}
		{#if output !== undefined}
			<div class="mt-2 text-sm text-gray-400">output</div>
			<div class="flex flex-row">
				<p class="text-grey whitespace-pre-wrap">
					{output.text}
				</p>
			</div>
		{/if}
	</div>
	{#if output}
		<div class="absolute right-4 top-4 rounded border bg-white bg-opacity-90 p-1 text-sm">
			score: {output?.metric}
		</div>
	{/if}
</div>
