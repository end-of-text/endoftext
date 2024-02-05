<script lang="ts">
	import InstanceTable from '$lib/components/Instances/InstanceTable.svelte';
	import PromptBar from '$lib/components/prompt/PromptBar.svelte';

	let { data } = $props();

	let instances = $state(data.instances);
	let prompt = $state(data.prompt);
</script>

<div class="flex h-full min-h-0 w-full">
	<div class="h-full w-[450px] shrink-0 border-r px-6 pt-4">
		<h1>Prompt</h1>
		<PromptBar bind:prompt projectId={data.projectId} />
	</div>
	<div class="flex grow flex-col px-6 pt-4">
		<h1>Data</h1>
		{#if data.instances}
			<InstanceTable bind:instances {prompt} />
		{/if}
	</div>
</div>
