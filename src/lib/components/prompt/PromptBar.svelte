<script lang="ts">
	import { getPrompt } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import { tooltip } from '$lib/tooltip.svelte';
	import { ChevronDown, ChevronUp, MoveLeft, MoveRight } from 'lucide-svelte';
	import PromptOptions from '../options/PromptOptions.svelte';
	import PromptEditor from './PromptEditor.svelte';
	import PromptSuggestions from './PromptSuggestions.svelte';

	let {
		prompt,
		suggestionApplied,
		userStatus,
		showOptions,
		editedPrompt,
		hoveredSuggestion,
		projectId,
		gettingSuggestions,
		suggestions,
		forwardTarget,
		setPromptMaximized,
		editPrompt,
		setPrompt,
		loadPrompt
	} = $props<{
		prompt: Tables<'prompts'>;
		suggestionApplied: number;
		userStatus: string;
		showOptions: boolean;
		editedPrompt: Tables<'prompts'>;
		hoveredSuggestion: Tables<'suggestions'> | null;
		projectId: string | undefined;
		gettingSuggestions: boolean;
		suggestions: Tables<'suggestions'>[] | undefined;
		forwardTarget: Tables<'prompts'>;
		setPromptMaximized: (maximized: boolean) => void;
		editPrompt: (newPrompt: Tables<'prompts'>, suggestionId: number) => void;
		setPrompt: () => void;
		loadPrompt: (id: number | null) => void;
	}>();

	async function forward() {
		let target = forwardTarget;
		while (target.parent_prompt_id !== null) {
			if (target.parent_prompt_id === prompt.id) {
				loadPrompt(target.id);
				return;
			}
			target = await getPrompt(target.parent_prompt_id);
		}
	}
</script>

<div class="flex h-full w-[450px] shrink-0 flex-col border-r px-6 py-4">
	<div class="mb-2 flex items-end justify-between">
		<div class="flex items-center gap-4">
			<h1 class="mr-2">Prompt</h1>
			<button
				class="group h-5 w-5 cursor-pointer text-gray-500 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-300"
				disabled={prompt.parent_prompt_id === null}
				onclick={() => loadPrompt(prompt.parent_prompt_id)}
				use:tooltip={{ text: 'Go to previous prompt' }}
			>
				<MoveLeft />
			</button>
			<button
				class="group h-5 w-5 cursor-pointer text-gray-500 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-300"
				disabled={prompt.id === forwardTarget.id}
				onclick={forward}
				use:tooltip={{ text: 'Go to next prompt' }}
			>
				<MoveRight />
			</button>
		</div>
		<button
			class="flex h-full items-center gap-1 opacity-40 transition-all hover:opacity-100"
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
		<PromptOptions bind:prompt={editedPrompt} {userStatus} />
	{/if}
	<div class="flex max-h-[50%] min-h-min flex-col pt-2">
		<PromptEditor
			{prompt}
			{hoveredSuggestion}
			{setPrompt}
			bind:suggestionApplied
			bind:editedPrompt
			{setPromptMaximized}
		/>
	</div>
	{#if projectId}
		<PromptSuggestions
			{prompt}
			{editedPrompt}
			{editPrompt}
			bind:gettingSuggestions
			bind:suggestions
			{suggestionApplied}
			setHoveredSuggestion={(suggestion) => (hoveredSuggestion = suggestion)}
		/>
	{/if}
</div>
