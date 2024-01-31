<script lang="ts">
	import PromptView from '$lib/components/prompts/PromptView.svelte';
	import type { SearchResult } from '$lib/types';

	let { searchResults } = $props<{ searchResults: SearchResult[] }>();
</script>

<div class="flex w-96 shrink-0 flex-col p-4 shadow-lg">
	<h2>Prompts</h2>
	<div class="flex flex-col gap-2">
		{#each searchResults as searchResult}
			<PromptView {searchResult} />
		{/each}
	</div>
</div>
