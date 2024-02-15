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
	<div class="flex min-h-0 grow">
		<PromptBar bind:prompt projectId={project.id || ''} />
		<InstanceTable bind:instances {project} {prompt} />
	</div>
</div>
