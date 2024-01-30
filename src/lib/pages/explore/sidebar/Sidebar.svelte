<script lang="ts">
	import PromptView from '$lib/components/prompts/PromptView.svelte';
	import type { SearchResult } from '$lib/types';

	let { searchResults } = $props<{ searchResults: SearchResult[] }>();
</script>

<div class="flex flex-col w-96 shrink-0 shadow-lg p-4">
	<h2>Prompts</h2>
	<div class="flex gap-2 flex-col">
		{#each searchResults as searchResult}
			<PromptView {searchResult} />
		{/each}
	</div>
</div>
