<script lang="ts">
	import { updatePrompt } from '$lib/api';
	import InstanceTable from '$lib/components/Instances/InstanceTable.svelte';
	import PaywallPopup from '$lib/components/popups/PaywallPopup.svelte';
	import PromptBar from '$lib/components/prompt/PromptBar.svelte';
	import ProjectHeader from '$lib/components/ui/ProjectHeader.svelte';
	import PromptView from '$lib/components/views/PromptView.svelte';
	import type { Tables } from '$lib/supabase';

	let { data } = $props();

	let project = $state(data.project);
	let instances = $state(data.instances);
	let prompt = $state(data.prompt);
	let editedPrompt = $state({ ...prompt });
	let suggestionApplied = $state(false);
	let hoveredSuggestion: Tables<'suggestions'> | null = $state(null);
	let showOptions = $state(false);
	let showPaywall = $state(false);
	let promptMaximized = $state(false);

	function editPrompt(suggestion: string) {
		suggestionApplied = true;
		editedPrompt.prompt = suggestion;
	}

	function setPrompt() {
		updatePrompt(editedPrompt).then((r) => {
			if (r === null) {
				showPaywall = true;
				return;
			}
			prompt = r;
			showOptions = false;
			suggestionApplied = false;
			editedPrompt = { ...prompt };
		});
	}
</script>

{#if showPaywall}
	<PaywallPopup
		onclose={() => (showPaywall = false)}
		message="You have reached your monthly limit of 100 prompts."
	/>
{/if}
{#if promptMaximized}
	<PromptView
		bind:prompt
		userStatus={data.user.status}
		onclose={() => (promptMaximized = false)}
		bind:hoveredSuggestion
		bind:suggestionApplied
		bind:editedPrompt
		projectId={data.project.id}
		{editPrompt}
		{setPrompt}
	/>
{/if}

<div class="flex h-full w-full flex-col">
	<ProjectHeader bind:project />
	<div class="flex min-h-0 grow">
		<PromptBar
			bind:prompt
			userStatus={data.user.status}
			bind:suggestionApplied
			bind:showOptions
			bind:editedPrompt
			bind:hoveredSuggestion
			projectId={data.project.id}
			setPromptMaximized={(maximized) => (promptMaximized = maximized)}
			{editPrompt}
			{setPrompt}
		/>
		<InstanceTable bind:instances project={data.project} {prompt} />
	</div>
</div>
