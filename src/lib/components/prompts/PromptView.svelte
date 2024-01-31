<script lang="ts">
	import { selectedPrompt } from '$lib/state.svelte';
	import { HyperparameterType, type SearchResult } from '$lib/types';

	let { searchResult } = $props<{ searchResult: SearchResult }>();

	let configTags = $derived(
		searchResult.modelConfiguration.filter((config) => config.type !== HyperparameterType.PROMPT)
	);
</script>

<button class="btn" onclick={() => selectedPrompt.set(searchResult)}>
	<p class="text-start">{searchResult.prompt}</p>
	<div class="flex w-full gap-2 pt-2 text-sm">
		<div class="flex gap-2">
			{#each configTags as config}
				<div class="rounded border p-1">
					{config.name}: {config.value}
				</div>
			{/each}
		</div>
		<div class="ml-auto shrink-0 p-1">score: {searchResult.averageMetric}</div>
	</div>
</button>
