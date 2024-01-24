<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/general/Button.svelte';
	import { elementSelection, elementsSelected } from '$lib/stores';
	import type { Entry } from '$lib/types';

	let loading = $state(false);
	let numberOfEntries = $state(5);

	elementSelection.set(true);
</script>

<form
	class="flex flex-col px-2"
	method="POST"
	action="?/generateSimilar"
	use:enhance={({ formData }) => {
		formData.append('elements', JSON.stringify($elementsSelected.map((e: Entry) => e.text)));
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	}}
>
	<label for="numberOfEntries">Number of Entries:</label>
	<input
		class="w-16 border p-2 rounded"
		type="number"
		name="numberOfEntries"
		max="20"
		min="1"
		bind:value={numberOfEntries}
		oninput={() => {
			if (numberOfEntries < 1) {
				numberOfEntries = 1;
			} else if (numberOfEntries > 20) {
				numberOfEntries = 20;
			}
		}}
		required
	/>
	{#if loading}
		<p>loading...</p>
	{:else}
		<Button classNames="self-end" disabled={$elementsSelected.length === 0}>Generate</Button>
	{/if}
</form>
