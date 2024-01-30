<script lang="ts">
	import { goto } from '$app/navigation';
	import DropZone from '$lib/components/ui/DropZone.svelte';

	async function uploadFile(event: CustomEvent<DragEvent>) {
		const dropEvent = event.detail;
		dropEvent.preventDefault();
		const file = dropEvent.dataTransfer.files[0];
		if (file.type === 'text/csv') {
			const reader = new FileReader();
			reader.onload = async (loadEvent) => {
				const text = loadEvent.target.result as string;
				await fetch(`/api/entries/`, {
					method: 'POST',
					body: JSON.stringify({ entries: text, clear: true })
				});
				await fetch('/api/prompt', {
					method: 'POST'
				});
				goto('/explore');
			};
			reader.readAsText(file);
		}
	}
</script>

<div class="h-full flex flex-col items-center justify-center">
	<div class="flex flex-col items-start">
		<h1>Specify Test Data</h1>
		<p class="mb-4">To evaluate your prompt, we'll need some test data.</p>
		<DropZone on:drop={uploadFile}
			>Drag here to upload csv. Needs a "question" and an "answer" column.</DropZone
		>
	</div>
</div>
