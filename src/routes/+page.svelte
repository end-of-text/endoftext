<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/general/Button.svelte';
	import DropZone from '$lib/components/general/DropZone.svelte';
	import H1 from '$lib/components/general/H1.svelte';
	import H2 from '$lib/components/general/H2.svelte';
	import TextArea from '$lib/components/general/TextArea.svelte';

	let { data } = $props();

	let loading = $state(false);
	let dataDescription = $state(data.dataDescription);
	let disabled = $derived(dataDescription === '');

	async function uploadFile(event: CustomEvent<DragEvent>) {
		const dropEvent = event.detail;
		dropEvent.preventDefault();
		const file = dropEvent.dataTransfer.files[0];
		console.log(file);
		if (file.type === 'text/plain') {
			const reader = new FileReader();
			reader.onload = async (loadEvent) => {
				const text = loadEvent.target.result;
				const lines = text.split('\n');
				await fetch(`/api/entries/`, {
					method: 'POST',
					body: JSON.stringify({ entries: lines, clear: true })
				});
				goto('/explore');
			};
			reader.readAsText(file);
		}
	}
</script>

<div class="h-full flex flex-col items-center justify-center">
	<H1>Generate Synthetic Data for AI</H1>
	<form
		class="flex w-full items-center justify-center"
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				update();
			};
		}}
	>
		<div class="flex flex-col items-center">
			<TextArea
				placeholder="Describe the data you want to generate."
				bind:value={dataDescription}
				classNames="mb-4"
				numRows={5}
				name="dataDescription"
			/>
			{#if loading}
				<p>loading...</p>
			{:else}
				<Button {disabled}>Generate</Button>
			{/if}
		</div>
	</form>
	<H2>or</H2>
	<DropZone on:drop={uploadFile}>Drag here to upload data</DropZone>
</div>
