<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Entry } from '$lib/entries';

	let { entries } = $props<{ entries: Entry[] }>();
	let count = $derived(entries.length);

	let loading = $state(false);
	let prompt = $state('');
	let numberOfEntries = $state(5);

	const saveEntries = () => {
		const entriesText = entries.map((entry) => entry.text).join('\n');
		const blob = new Blob([entriesText], { type: 'text/plain;charset=utf-8' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'entries.txt';
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	};
</script>

<p class="text-xl mb-5">Welcome to Zeno Synth! Describe the type of data you want to generate.</p>
<form
	class="flex gap-4 items-center"
	method="POST"
	use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	}}
>
	<input
		name="prompt"
		class="border p-2 rounded"
		type="text"
		placeholder="Generate with OpenAI."
		bind:value={prompt}
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
	<button class="px-3 py-2 border rounded"> Generate </button>
</form>
{#if loading}
	<p>loading...</p>
{/if}
<br class="h-10" />
<div class="flex gap-10 mb-5 items-center">
	<p class="text-xl">{count} entries</p>
	<button class="border px-3 py-2 rounded hover:bg-slate-200 transition" onclick={saveEntries}>
		download entries
	</button>
</div>
<div class="flex gap-2 flex-col">
	{#if entries !== null}
		{#each entries as entry}
			<div
				class="p-3 border border-gray-200 rounded"
				contenteditable="true"
				bind:textContent={entry.text}
			>
				{entry.text}
			</div>
		{/each}
	{:else}
		<p>loading...</p>
	{/if}
</div>
