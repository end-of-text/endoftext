<script lang="ts">
	import { updatePrompt } from '$lib/api';
	import InstanceTable from '$lib/components/Instances/InstanceTable.svelte';
	import PromptOptions from '$lib/components/options/PromptOptions.svelte';
	import PaywallPopup from '$lib/components/popups/PaywallPopup.svelte';
	import PromptBar from '$lib/components/prompt/PromptBar.svelte';
	import PromptEditor from '$lib/components/prompt/PromptEditor.svelte';
	import type { Tables } from '$lib/supabase';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';

	let { data } = $props();

	let instances = $state(data.instances);
	let prompt = $state(data.prompt);
	let editedPrompt = $state({ ...prompt });
	let suggestionApplied = $state(false);
	let hoveredSuggestion: Tables<'suggestions'> | null = $state(null);
	let showOptions = $state(false);
	let showPaywall = $state(false);

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

<PromptBar bind:prompt projectId={data.project.id || ''} userStatus={data.user.status}>
	<div class="mb-2 flex items-end justify-between">
		<h1>Prompt</h1>
		<button
			class="flex items-center gap-1 opacity-40 transition-all hover:opacity-100"
			onclick={() => (showOptions = !showOptions)}
		>
			<span class="text-black">Model Options</span>
			{#if showOptions}
				<ChevronUp class="h-5 w-5" />
			{:else}
				<ChevronDown class="h-5 w-5" />
			{/if}
		</button>
	</div>
	{#if showOptions}
		<PromptOptions bind:prompt={editedPrompt} userStatus={data.user.status} />
	{/if}
	<div class="flex max-h-[50%] min-h-min flex-col pt-2">
		<PromptEditor
			{prompt}
			{hoveredSuggestion}
			{setPrompt}
			bind:suggestionApplied
			bind:editedPrompt
		/>
	</div>
</PromptBar>
<InstanceTable bind:instances project={data.project} {prompt} />
