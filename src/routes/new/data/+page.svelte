<script lang="ts">
	import { goto } from '$app/navigation';
	import DropZone from '$lib/components/ui/DropZone.svelte';

	let loadingState = $state<string | undefined>(undefined);

	async function uploadFile(event: CustomEvent<DragEvent>) {
		loadingState = 'Processing uploaded file...';
		const dropEvent = event.detail;
		dropEvent.preventDefault();
		if (!dropEvent.dataTransfer) {
			return;
		}
		const file = dropEvent.dataTransfer.files[0];
		if (file.type === 'text/csv') {
			const reader = new FileReader();
			reader.onload = async (loadEvent) => {
				if (!loadEvent.target) {
					return;
				}
				const text = loadEvent.target.result as string;
				await fetch(`/api/entries/`, {
					method: 'POST',
					body: JSON.stringify({ entries: text, clear: true })
				});
				const prompt = await fetch('/api/prompt', {
					method: 'POST'
				});
				const promptText = await prompt.text();
				loadingState = 'Optimizing Prompt...';
				await fetch(`/api/prompt/optimize/${promptText}`, {
					method: 'POST'
				});
				loadingState = undefined;
				goto('/explore');
			};
			reader.readAsText(file);
		}
	}
</script>

<div class="flex h-full flex-col items-center justify-center">
	<div class="flex flex-col items-start">
		<h1>Specify Test Data</h1>
		{#if loadingState !== undefined}
			<p>{loadingState}</p>
		{:else}
			<p class="mb-4">To evaluate your prompt, we'll need some test data.</p>
			<DropZone on:drop={uploadFile}
				>Drag here to upload csv. Needs a "question" and an "answer" column.</DropZone
			>
		{/if}
	</div>
</div>
