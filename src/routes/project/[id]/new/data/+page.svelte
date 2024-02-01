<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import DropZone from '$lib/components/ui/DropZone.svelte';
	import { get } from 'svelte/store';

	let instances = $state<string[]>();
	let loadingState = $state<string | undefined>(undefined);

	$effect(() => {
		if (instances === undefined) {
			const localInstances = localStorage.getItem('instances' + get(page).params.id);
			if (localInstances !== null) {
				instances = JSON.parse(localInstances);
			} else {
				instances = ['example 1', 'example 2', 'example 3'];
			}
		} else {
			localStorage.setItem('instances' + get(page).params.id, JSON.stringify(instances));
		}
	});

	async function uploadFile(event: CustomEvent<DragEvent>) {
		loadingState = 'Processing uploaded file...';
		const dropEvent = event.detail;
		dropEvent.preventDefault();
		if (!dropEvent.dataTransfer) {
			return;
		}
		const file = dropEvent.dataTransfer.files[0];
		if (file.type === 'text/plain') {
			const reader = new FileReader();
			reader.onload = async (loadEvent) => {
				if (!loadEvent.target) {
					return;
				}
				const text = loadEvent.target.result as string;
				const entries = text.split('\n');
				if (instances) {
					instances = [...instances, ...entries];
				}
			};
			reader.readAsText(file);
		}
	}
</script>

<div class="flex h-full flex-col items-center justify-center">
	<form class="flex flex-col items-start" method="POST" use:enhance>
		<div class="mb-5 flex w-full items-center justify-between">
			<h1>Specify Test Data</h1>
			<div class="flex gap-2">
				<button
					class="btn"
					onclick={(e) => {
						e.preventDefault();
						instances = [];
					}}
				>
					clear
				</button>
				<button class="btn">next</button>
			</div>
		</div>
		<p class="mb-4">
			To evaluate your prompt, we'll need some test data. Manually type in instances here or drag in
			a text file.
		</p>
		{#if instances}
			<div class="flex w-full flex-col gap-2">
				{#each instances as instance}
					<textarea
						name="instance"
						class="w-full"
						placeholder="Enter text here"
						bind:value={instance}
					/>
				{/each}
			</div>
			<button
				class="btn my-2 w-full"
				onclick={(e) => {
					e.preventDefault();
					instances?.push('');
				}}
			>
				Add More
			</button>
		{/if}
		{#if loadingState !== undefined}
			<p>{loadingState}</p>
		{:else}
			<DropZone classNames="mt-2 m-auto" on:drop={uploadFile}>
				Drag here to upload csv. Needs a "question" and an "answer" column.
			</DropZone>
		{/if}
	</form>
</div>
