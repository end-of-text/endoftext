<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import InstanceTable from '$lib/components/Instances/InstanceTable.svelte';
	import PromptBar from '$lib/components/prompt/PromptBar.svelte';
	import ProjectHeader from '$lib/components/ui/ProjectHeader.svelte';
	import { dataGenerationInstructionState, showDataGenerationState } from '$lib/state.svelte.js';
	import { setContext } from 'svelte';

	let { data } = $props();

	let project = $state(data.project);
	let instances = $state(data.instances);
	let predictions = $state(data.predictions);
	let suggestions = $state(data.suggestions);
	let prompt = $state(data.prompt);
	let childPrompt = $state(data.childPrompt);

	let dataGenerationInstruction = dataGenerationInstructionState('');
	let showDataGeneration = showDataGenerationState(false);
	setContext('dataGenerationInstruction', dataGenerationInstruction);
	setContext('showDataGeneration', showDataGeneration);

	afterNavigate(() => {
		prompt = data.prompt;
		childPrompt = data.childPrompt;
		instances = data.instances;
		predictions = data.predictions;
		suggestions = data.suggestions;
		project = data.project;
	});
</script>

<div class="flex h-full w-full flex-col">
	<ProjectHeader bind:project {prompt} />
	<div class="flex min-h-0 grow">
		<PromptBar
			{prompt}
			{childPrompt}
			{suggestions}
			userStatus={data.user.status}
			projectId={data.project.id}
		/>
		<InstanceTable bind:instances bind:project bind:predictions {prompt} />
	</div>
</div>
