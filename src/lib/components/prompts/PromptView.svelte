<script lang="ts">
	import { selectedPrompt } from '$lib/state.svelte';
	import { HyperparameterType, type SearchResult } from '$lib/types';

	let { searchResult } = $props<{ searchResult: SearchResult }>();

	let configTags = $derived(
		searchResult.modelConfiguration.filter((config) => config.type !== HyperparameterType.PROMPT)
	);
</script>

<button class="border p-2 rounded flex flex-col" onclick={() => selectedPrompt.set(searchResult)}>
	<p class="text-start">{searchResult.prompt}</p>
	<div class="flex gap-2 w-full text-sm pt-2">
		<div class="flex gap-2">
			{#each configTags as config}
				<div class="border rounded p-1">
					{config.name}: {config.value}
				</div>
			{/each}
		</div>
		<div class="shrink-0 p-1 ml-auto">score: {searchResult.averageMetric}</div>
	</div>
</button>
