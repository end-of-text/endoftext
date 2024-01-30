<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Entry } from '$lib/entries';

	let { entries } = $props<{ entries: Entry[] }>();
	let count = $derived(entries.length);
	const getAverageNumberOfWords = () => {
		const totalWords = entries.map((entry) => entry.text.split(' ').length);
		return (totalWords.reduce((acc, curr) => acc + curr, 0) / entries.length).toLocaleString();
	};
	let meanWords = $derived(getAverageNumberOfWords());

	const getVarianceOfEntryTextFields = () => {
		const averageNumberOfWords = getAverageNumberOfWords();
		const sumOfSquaredDifferences = entries.reduce((acc, entry) => {
			const wordsDifference = entry.text.split(' ').length - averageNumberOfWords;
			return acc + Math.pow(wordsDifference, 2);
		}, 0);
		return sumOfSquaredDifferences / entries.length;
	};

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
	{#if loading}
		<p>loading...</p>
	{/if}
</form>
<br class="h-10" />
<div class="flex gap-10 mb-5 items-center">
	<p class="text-xl">{count} entries, {meanWords} average # of words</p>
	<button class="border px-3 py-2 rounded hover:bg-slate-200 transition" onclick={saveEntries}>
		download entries
	</button>
</div>
<table class="min-w-full divide-y divide-gray-200">
	<tbody class="bg-white divide-y divide-gray-200">
		{#if entries !== null}
			{#each entries as entry}
				<tr>
					<td class="px-6 py-4 whitespace-nowrap">
						<input
							type="checkbox"
							class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
						/>
					</td>
					<td
						class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
						contenteditable="true"
						bind:textContent={entry.text}
					>
						{entry.text}
					</td>
				</tr>
			{/each}
		{:else}
			<tr>
				<td colspan="2" class="px-6 py-4 whitespace-nowrap text-center">
					<p>loading...</p>
				</td>
			</tr>
		{/if}
	</tbody>
</table>
