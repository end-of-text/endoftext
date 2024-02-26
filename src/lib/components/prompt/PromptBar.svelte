<script lang="ts">
	import { goto } from '$app/navigation';
	import { updatePrompt } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import { tooltip } from '$lib/tooltip.svelte';
	import { ChevronDown, ChevronUp, MoveLeft, MoveRight } from 'lucide-svelte';
	import PromptOptions from '../options/PromptOptions.svelte';
	import PromptView from '../views/PromptView.svelte';
	import PromptEditor from './PromptEditor.svelte';
	import PromptSuggestions from './PromptSuggestions.svelte';

	let {
		prompt,
		childPrompt,
		suggestionApplied,
		userStatus,
		showOptions,
		editedPrompt,
		hoveredSuggestion,
		projectId,
		gettingSuggestions,
		suggestions,
		showPaywall
	} = $props<{
		prompt: Tables<'prompts'>;
		childPrompt: Tables<'prompts'> | undefined;
		suggestionApplied: number;
		userStatus: string;
		showOptions: boolean;
		editedPrompt: Tables<'prompts'>;
		hoveredSuggestion: Tables<'suggestions'> | null;
		projectId: string | undefined;
		gettingSuggestions: boolean;
		suggestions: Promise<Tables<'suggestions'>[] | undefined>;
		showPaywall: boolean;
	}>();

	let promptMaximized = $state(false);

	function loadPrompt(id: number | null) {
		if (id === null) goto(`/project/${projectId}`);
		goto(`/project/${projectId}/${id}`);
	}

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
			goto(`/project/${projectId}/${r.id}`);
		});
	}
</script>

{#if promptMaximized}
	<PromptView
		{prompt}
		{suggestions}
		{userStatus}
		{projectId}
		onclose={() => (promptMaximized = false)}
		bind:hoveredSuggestion
		bind:suggestionApplied
		bind:editedPrompt
		bind:gettingSuggestions
		{editPrompt}
		{setPrompt}
	/>
{/if}

<div class="flex h-full w-[450px] shrink-0 flex-col border-r px-6 py-4">
	<div class="mb-2 flex items-end justify-between">
		<div class="flex items-center gap-4">
			<h1 class="mr-2">Prompt</h1>
			<button
				class="group h-5 w-5 cursor-pointer text-gray-active transition-colors hover:text-gray-hovered disabled:cursor-not-allowed disabled:text-gray-inactive"
				disabled={prompt.parent_prompt_id === null}
				onclick={() => loadPrompt(prompt.parent_prompt_id)}
				use:tooltip={{ text: 'Go to previous prompt' }}
			>
				<MoveLeft />
			</button>
			<button
				class="group h-5 w-5 cursor-pointer text-gray-active transition-colors hover:text-gray-hovered disabled:cursor-not-allowed disabled:text-gray-inactive"
				disabled={childPrompt === undefined}
				onclick={() => loadPrompt(childPrompt!.id)}
				use:tooltip={{ text: 'Go to next prompt' }}
			>
				<MoveRight />
			</button>
		</div>
		<button
			class="flex h-full items-center gap-1 text-gray-active transition-all hover:text-gray-hovered"
			onclick={() => (showOptions = !showOptions)}
		>
			<span>Model Options</span>
			{#if showOptions}
				<ChevronUp class="h-5 w-5" />
			{:else}
				<ChevronDown class="h-5 w-5" />
			{/if}
		</button>
	</div>
	{#if showOptions}
		<PromptOptions bind:prompt={editedPrompt} {userStatus} />
	{/if}
	<div class="flex max-h-[50%] min-h-min flex-col pt-2">
		<PromptEditor
			{prompt}
			{hoveredSuggestion}
			{setPrompt}
			bind:promptMaximized
			bind:suggestionApplied
			bind:editedPrompt
		/>
	</div>
	{#if projectId}
		<PromptSuggestions
			{prompt}
			{editedPrompt}
			{editPrompt}
			bind:gettingSuggestions
			{suggestions}
			{suggestionApplied}
			setHoveredSuggestion={(suggestion) => (hoveredSuggestion = suggestion)}
		/>
	{/if}
</div>
