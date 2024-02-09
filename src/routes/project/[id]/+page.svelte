<script lang="ts">
	import InstanceTable from '$lib/components/Instances/InstanceTable.svelte';
	import PromptBar from '$lib/components/prompt/PromptBar.svelte';
	import ProjectHeader from '$lib/components/ui/ProjectHeader.svelte';

	let { data } = $props();

	let instances = $state(data.instances);
	let prompt = $state(data.prompt);
	let project = $state(data.project);
</script>

<div class="flex h-full w-full flex-col overflow-hidden">
	<ProjectHeader bind:project />

	<div class="flex h-full">
		<div class="h-full min-w-[450px] max-w-[450px] overflow-auto border-r px-6 pt-4">
			<PromptBar bind:prompt projectId={project.id || ''} />
		</div>
		<div class="flex grow flex-col px-6 pt-4">
			{#if data.instances}
				<InstanceTable bind:instances {project} {prompt} />
			{/if}
		</div>
	</div>
</div>
