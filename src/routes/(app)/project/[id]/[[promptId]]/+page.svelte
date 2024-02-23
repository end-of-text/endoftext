<script lang="ts">
	import { afterNavigate, goto, invalidate } from '$app/navigation';
	import { getSuggestions, updatePrompt } from '$lib/api';
	import InstanceTable from '$lib/components/Instances/InstanceTable.svelte';
	import PaywallPopup from '$lib/components/popups/PaywallPopup.svelte';
	import PromptBar from '$lib/components/prompt/PromptBar.svelte';
	import ProjectHeader from '$lib/components/ui/ProjectHeader.svelte';
	import PromptView from '$lib/components/views/PromptView.svelte';
	import type { Tables } from '$lib/supabase';
	import { untrack } from 'svelte';

	let { data } = $props();

	let project = $state(data.project);
	let instances = $state(data.instances);
	let predictions = $state(data.predictions);
	let prompt = $state(data.prompt);
	let editedPrompt = $state({ ...data.prompt });
	let suggestionApplied = $state<number>(-1);
	let hoveredSuggestion: Tables<'suggestions'> | null = $state(null);
	let showOptions = $state(false);
	let showPaywall = $state(false);
	let promptMaximized = $state(false);
	let gettingSuggestions = $state(false);
	let suggestions: Tables<'suggestions'>[] | undefined = $state([]);
	let forwardTarget = $state(data.prompt);

	function editPrompt(newPrompt: Tables<'prompts'>, suggestionId: number) {
		suggestionApplied = suggestionId;
		editedPrompt = newPrompt;
	}

	function setPrompt() {
		showOptions = false;
		suggestionApplied = -1;
		updatePrompt(editedPrompt).then((r) => {
			if (r === null) {
				showPaywall = true;
				return;
			}
			invalidate('prompt').then(() => {
				prompt = data.prompt;
				forwardTarget = data.prompt;
				editedPrompt = { ...data.prompt };
				predictions = data.predictions;
			});
		});
	}

	function loadPrompt(id: number | null) {
		if (id === null) goto(`/project/${data.project.id}`);
		goto(`/project/${data.project.id}/${id}`);
	}

	$effect(() => {
		untrack(() => {
			gettingSuggestions = true;
			suggestions = [];
		});
		getSuggestions(prompt).then((r) => {
			untrack(() => {
				suggestions = r;
				gettingSuggestions = false;
			});
		});
	});

	afterNavigate(() => {
		editedPrompt = { ...data.prompt };
		prompt = data.prompt;
		instances = data.instances;
		predictions = data.predictions;
		project = data.project;
	});
</script>

{#if showPaywall}
	<PaywallPopup
		onclose={() => (showPaywall = false)}
		message="You have reached your monthly limit of 100 prompts."
	/>
{/if}
{#if promptMaximized}
	<PromptView
		{prompt}
		userStatus={data.user.status}
		onclose={() => (promptMaximized = false)}
		bind:hoveredSuggestion
		bind:suggestionApplied
		bind:editedPrompt
		bind:gettingSuggestions
		bind:suggestions
		projectId={data.project.id}
		{editPrompt}
		{setPrompt}
		{loadPrompt}
		{forwardTarget}
	/>
{/if}

<div class="flex h-full w-full flex-col">
	<ProjectHeader bind:project />
	<div class="flex min-h-0 grow">
		<PromptBar
			{prompt}
			userStatus={data.user.status}
			bind:suggestionApplied
			bind:gettingSuggestions
			bind:showOptions
			bind:editedPrompt
			bind:hoveredSuggestion
			bind:suggestions
			projectId={data.project.id}
			setPromptMaximized={(maximized) => (promptMaximized = maximized)}
			{forwardTarget}
			{editPrompt}
			{setPrompt}
			{loadPrompt}
		/>
		<InstanceTable bind:instances bind:project bind:predictions {prompt} />
	</div>
</div>
