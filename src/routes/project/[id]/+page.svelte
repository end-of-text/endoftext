<script lang="ts">
	import InstanceTable from '$lib/components/Instances/InstanceTable.svelte';
	import CurrentPrompt from '$lib/components/prompt/PromptEditor.svelte';
	import PromptSuggestions from '$lib/components/prompt/PromptSuggestions.svelte';

	let { data } = $props();

	let instances = $state(data.instances);
	let prompt = $state(data.prompt);
	let editedPrompt = $state(data.prompt.prompt);
</script>

<div class="flex h-full w-full">
	<div class="w-1/3 p-5">
		{#if data.prompt}
			<h1>Prompt</h1>
			<CurrentPrompt bind:prompt bind:editedPrompt />
			{#if data.projectId}
				<PromptSuggestions projectId={data.projectId} {prompt} bind:editedPrompt />
			{/if}
		{/if}
	</div>
	<div class="flex w-2/3 grow flex-col p-5">
		<h1>Data</h1>
		{#if data.instances}
			<InstanceTable bind:instances {prompt} />
		{/if}
	</div>
</div>
