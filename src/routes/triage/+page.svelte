<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/general/Button.svelte';
	import TriageElement from '$lib/components/triage/TriageElement.svelte';
	import type { Entry } from '$lib/types.js';

	let { data } = $props();

	let entries = $state(data.entries);

	async function deleteEntry(entry: Entry) {
		await fetch(`/api/entries/${entry.id}`, {
			method: 'DELETE'
		});
		entries = entries.filter((e) => e.id !== entry.id);
	}
</script>

<div class="flex flex-col items-center m-4">
	<div class="flex flex-col w-full">
		{#if entries.length > 0}
			{#each entries as entry}
				<TriageElement {entry} on:delete={() => deleteEntry(entry)} />
			{/each}
		{:else}
			<p>No entries remaining. Please refine your prompt.</p>
		{/if}
	</div>
	<div class="mt-4">
		{#if entries.length === 0}
			<Button on:click={() => goto('/')}>Refine Prompt</Button>
		{:else}
			<Button on:click={() => goto('/explore')}>Continue</Button>
		{/if}
	</div>
</div>
