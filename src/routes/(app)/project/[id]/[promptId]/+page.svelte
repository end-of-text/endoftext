<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import InstanceTable from '$lib/components/Instances/InstanceTable.svelte';
	import PromptBar from '$lib/components/prompt/PromptBar.svelte';
	import ProjectHeader from '$lib/components/ui/ProjectHeader.svelte';
	import CompareView from '$lib/components/views/CompareView.svelte';

	let { data } = $props();

	let project = $state(data.project);
	let instances = $state(data.instances);
	let predictions = $state(data.predictions);
	let suggestions = $state(data.suggestions);
	let prompt = $state(data.prompt);
	let editedPrompt = $state({ ...data.prompt });
	let childPrompt = $state(data.childPrompt);
	let comparePrompt = $state(false);

	afterNavigate(() => {
		prompt = data.prompt;
		editedPrompt = { ...data.prompt };
		childPrompt = data.childPrompt;
		instances = data.instances;
		predictions = data.predictions;
		suggestions = data.suggestions;
		project = data.project;
	});
</script>

{#if comparePrompt}
	<CompareView onclose={() => (comparePrompt = false)} {prompt} {instances} />
{/if}

<div class="flex h-full w-full flex-col">
	<ProjectHeader bind:project {prompt} />
	<div class="flex min-h-0 grow">
		<PromptBar
			bind:prompt
			bind:editedPrompt
			bind:childPrompt
			bind:suggestions
			bind:comparePrompt
			userStatus={data.user.status}
			projectId={data.project.id}
		/>
		<InstanceTable bind:instances bind:project bind:predictions bind:prompt />
	</div>
</div>
