<script lang="ts">
	import InstanceTable from '$lib/components/Instances/InstanceTable.svelte';
	import PromptBar from '$lib/components/prompt/PromptBar.svelte';
	import ProjectHeader from '$lib/components/ui/ProjectHeader.svelte';

	let { data } = $props();

	let instances = $state(data.instances);
	let prompt = $state(data.prompt);
</script>

<div class="flex h-full w-full flex-col">
	<ProjectHeader project={data.project} />
	<div class="flex grow">
		<div class="h-full w-[450px] shrink-0 border-r px-6 pt-4">
			<PromptBar bind:prompt projectId={data.project.id || ''} />
		</div>
		<div class="flex grow flex-col px-6 pt-4">
			<h1>Data</h1>
			{#if data.instances}
				<InstanceTable bind:instances {prompt} />
			{/if}
		</div>
	</div>
</div>
