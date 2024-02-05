<script lang="ts">
	import InstanceTable from '$lib/components/Instances/InstanceTable.svelte';
	import PromptBar from '$lib/components/prompt/PromptBar.svelte';

	let { data } = $props();

	let instances = $state(data.instances);
	let prompt = $state(data.prompt);
</script>

<div class="flex h-full min-h-0 w-full">
	<PromptBar bind:prompt projectId={data.projectId} />
	<div class="flex grow flex-col p-2">
		<h1>Data</h1>
		{#if data.instances}
			<InstanceTable bind:instances {prompt} />
		{/if}
	</div>
</div>
