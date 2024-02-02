<script lang="ts">
	import InstanceTable from '$lib/components/Instances/InstanceTable.svelte';
	import PromptBar from '$lib/components/prompt/PromptBar.svelte';
	import PromptTree from '$lib/components/prompt/PromptTree.svelte';

	let { data } = $props();
</script>

<div class="flex h-full w-full">
	<div class="flex grow flex-col p-2">
		<h1>Data</h1>
		<PromptTree prompts={data.prompts} />
		<h2 class="mt-4">instances</h2>
		{#if data.instances}
			<InstanceTable instances={data.instances} />
		{/if}
	</div>
	{#if data.projectId}
		<PromptBar projectId={data.projectId} />
	{/if}
</div>
