<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/general/Button.svelte';
	import TextArea from '$lib/components/general/TextArea.svelte';

	let loading = $state(false);
	let prompt = $state('');
	let numberOfEntries = $state(5);
</script>

<form
	class="flex flex-col px-2"
	method="POST"
	action="?/generateFromPrompt"
	use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	}}
>
	<TextArea
		label="Prompt"
		placeholder="Generate with OpenAI."
		bind:value={prompt}
		classNames="mb-4"
		numRows={5}
		name="prompt"
		width="w-full"
	/>
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
		<Button classNames="self-end">Generate</Button>
	{/if}
</form>
