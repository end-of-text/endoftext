<script>
	import GenerationBar from '$lib/components/explore/generation/GenerationBar.svelte';
	import Table from '$lib/components/explore/Table.svelte';
	import Button from '$lib/components/general/Button.svelte';

	let { data } = $props();

	const saveEntries = () => {
		const entriesText = data.entries.map((entry) => entry.text).join('\n');
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

<div class="flex relative h-full">
	<GenerationBar />
	<Table entries={data.entries} />
	<div class="absolute bottom-4 right-4">
		<Button on:click={saveEntries}>Download</Button>
	</div>
</div>
