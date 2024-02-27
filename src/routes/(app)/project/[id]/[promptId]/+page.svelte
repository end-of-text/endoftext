<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import InstanceTable from '$lib/components/Instances/InstanceTable.svelte';
	import PaywallPopup from '$lib/components/popups/PaywallPopup.svelte';
	import PromptBar from '$lib/components/prompt/PromptBar.svelte';
	import ProjectHeader from '$lib/components/ui/ProjectHeader.svelte';
	import { createDataGenerationState } from '$lib/state.svelte.js';
	import type { Tables } from '$lib/supabase';
	import { setContext } from 'svelte';

	let { data } = $props();

	let project = $state(data.project);
	let instances = $state(data.instances);
	let predictions = $state(data.predictions);
	let suggestions = $state(data.suggestions);
	let prompt = $state(data.prompt);
	let childPrompt = $state(data.childPrompt);
	let editedPrompt = $state({ ...data.prompt });
	let suggestionApplied = $state<number>(-1);
	let hoveredSuggestion: Tables<'suggestions'> | null = $state(null);
	let showOptions = $state(false);
	let showPaywall = $state(false);
	let gettingSuggestions = $state(false);

	// Keep in context to avoid prop drilling
	let generationOptions = createDataGenerationState({
		instruction: '',
		showGenerateOptions: false
	});
	setContext('generationOptions', generationOptions);

	afterNavigate(() => {
		editedPrompt = { ...data.prompt };
		prompt = data.prompt;
		childPrompt = data.childPrompt;
		instances = data.instances;
		predictions = data.predictions;
		suggestions = data.suggestions;
		project = data.project;
		showOptions = false;
		suggestionApplied = -1;
	});
</script>

{#if showPaywall}
	<PaywallPopup
		onclose={() => (showPaywall = false)}
		message="You have reached your monthly limit of 100 prompts."
	/>
{/if}

<div class="flex h-full w-full flex-col">
	<ProjectHeader bind:project {prompt} />
	<div class="flex min-h-0 grow">
		<PromptBar
			{prompt}
			{childPrompt}
			{suggestions}
			userStatus={data.user.status}
			bind:showPaywall
			bind:suggestionApplied
			bind:gettingSuggestions
			bind:showOptions
			bind:editedPrompt
			bind:hoveredSuggestion
			projectId={data.project.id}
		/>
		<InstanceTable bind:instances bind:project bind:predictions {prompt} />
	</div>
</div>
