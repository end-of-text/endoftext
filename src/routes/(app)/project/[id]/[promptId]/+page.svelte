<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
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
	let childPrompt = $state(data.childPrompt);
	let editedPrompt = $state({ ...data.prompt });
	let suggestionApplied = $state<number>(-1);
	let hoveredSuggestion: Tables<'suggestions'> | null = $state(null);
	let showOptions = $state(false);
	let showPaywall = $state(false);
	let promptMaximized = $state(false);
	let gettingSuggestions = $state(false);
	let suggestions: Tables<'suggestions'>[] | undefined = $state([]);

	function editPrompt(newPrompt: Tables<'prompts'>, suggestionId: number) {
		suggestionApplied = suggestionId;
		editedPrompt = newPrompt;
	}

	function setPrompt() {
		updatePrompt(editedPrompt).then((r) => {
			if (r === null) {
				showPaywall = true;
				return;
			}
			goto(`/project/${data.project.id}/${r.id}`);
		});
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
		childPrompt = data.childPrompt;
		instances = data.instances;
		predictions = data.predictions;
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
	/>
{/if}

<div class="flex h-full w-full flex-col">
	<ProjectHeader bind:project {prompt} />
	<div class="flex min-h-0 grow">
		<PromptBar
			{prompt}
			{childPrompt}
			userStatus={data.user.status}
			bind:suggestionApplied
			bind:gettingSuggestions
			bind:showOptions
			bind:editedPrompt
			bind:hoveredSuggestion
			bind:suggestions
			projectId={data.project.id}
			setPromptMaximized={(maximized) => (promptMaximized = maximized)}
			{editPrompt}
			{setPrompt}
		/>
		<InstanceTable bind:instances bind:project bind:predictions {prompt} />
	</div>
</div>
