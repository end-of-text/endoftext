<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import Button from '$lib/components/general/Button.svelte';

	let { data } = $props();

	let loading = $state(false);
	let dataDescription = $state(data.dataDescription);
	let dragOver = $state(false);
	let disabled = $derived(dataDescription === '');

	$effect(() => {
		if (browser) {
			window.addEventListener('dragover', () => (dragOver = true));
			window.addEventListener('dragleave', () => (dragOver = false));
			window.addEventListener('drop', (e) => {
				e.preventDefault();
				dragOver = false;
			});
		}
	});

	function dragOverFn(event: DragEvent) {
		event.preventDefault();
	}

	async function uploadFile(event: DragEvent) {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		if (file.type === 'text/plain') {
			const reader = new FileReader();
			reader.onload = async (event) => {
				const text = event.target.result;
				const lines = text.split('\n');
				await fetch(`/api/entries/`, {
					method: 'POST',
					body: JSON.stringify({ entries: lines })
				});
				invalidateAll();
				dataDescription = lines;
			};
			reader.readAsText(file);
			await goto('/explore');
		}
	}
</script>

<div class="h-full flex flex-col items-center justify-center">
	<h1
		class="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 text-3xl italic font-black mb-16"
	>
		Generate Synthetic Data for AI
	</h1>
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
		<div class="flex items-start">
			<input
				name="dataDescription"
				class="border p-2 rounded mr-4 w-96"
				type="text"
				placeholder="Description of your data."
			/>
			{#if loading}
				<p>loading...</p>
			{:else}
				<Button {disabled}>Generate</Button>
			{/if}
		</div>
	</form>
	<h2 class="font-black text-xl my-10">or</h2>
	<div class="group relative w-100 rounded">
		<div
			class="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 group-hover:opacity-100 opacity-75 blur transition duration-500"
		></div>
		{#if dragOver}
			<div
				ondragover={dragOverFn}
				ondrop={uploadFile}
				class="relative rounded bg-white px-20 py-10"
				role="button"
			>
				HERE!
			</div>
		{:else}
			<div class="relative rounded bg-white px-20 py-10">drag here to upload</div>
		{/if}
	</div>
</div>
