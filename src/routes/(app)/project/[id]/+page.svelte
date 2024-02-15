<script lang="ts">
	import InstanceTable from '$lib/components/Instances/InstanceTable.svelte';
	import PromptBar from '$lib/components/prompt/PromptBar.svelte';
	import ProjectHeader from '$lib/components/ui/ProjectHeader.svelte';

	let { data } = $props();

	let instances = $state(data.instances);
	let prompt = $state(data.prompt);
	let project = $state(data.project);
</script>

<div class="flex h-full w-full flex-col">
	<ProjectHeader bind:project />
	<div class="flex h-full w-full flex-1">
		<PromptBar bind:prompt projectId={project.id || ''} />
		<div class="flex h-full w-full flex-col px-6 pt-4">
			<InstanceTable bind:instances {project} {prompt} />
		</div>
	</div>
</div>
