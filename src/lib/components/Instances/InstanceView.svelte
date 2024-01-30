<script lang="ts">
	import { selectedPrompt } from '$lib/state.svelte';
	import type { Entry } from '$lib/types';

	let { entry } = $props<{ entry: Entry }>();

	let output = $derived(selectedPrompt.prompt?.outputs[entry.id] ?? undefined);
</script>

<div class="break-words rounded border relative">
	<div class="p-4">
		{#if entry.question !== undefined}
			<div class="flex flex-row">
				<p class="whitespace-pre-wrap text-grey">
					{entry.question}
				</p>
			</div>
		{/if}
		{#if entry.answer !== undefined}
			<div class="mt-2 text-sm text-gray-400">label</div>
			<div class="flex flex-row">
				<p class="whitespace-pre-wrap text-grey">
					{entry.answer}
				</p>
			</div>
		{/if}
		{#if output !== undefined}
			<div class="mt-2 text-sm text-gray-400">output</div>
			<div class="flex flex-row">
				<p class="whitespace-pre-wrap text-grey">
					{output.text}
				</p>
			</div>
		{/if}
	</div>
	{#if output}
		<div class="absolute top-4 right-4 text-sm bg-white rounded bg-opacity-90 p-1 border">
			score: {output?.metric}
		</div>
	{/if}
</div>
