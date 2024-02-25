<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import autosize from '$lib/autosize';
	import { clickOutside } from '$lib/clickOutside';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Tables } from '$lib/supabase';
	import { Check, Copy, Expand, Save, Undo2 } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import RewriteBox from './RewriteBox.svelte';
	import SuggestionOverlay from './SuggestionOverlay.svelte';

	let {
		prompt,
		hoveredSuggestion,
		suggestionApplied,
		editedPrompt,
		setPrompt,
		editPrompt,
		setPromptMaximized = undefined
	} = $props<{
		prompt: Tables<'prompts'>;
		hoveredSuggestion: Tables<'suggestions'> | null;
		suggestionApplied: number;
		editedPrompt: Tables<'prompts'>;
		setPrompt: () => void;
		editPrompt: (newPrompt: Tables<'prompts'>, suggestionId: number) => void;
		setPromptMaximized?: (maximized: boolean) => void;
	}>();

	let promptWasEdited = $derived(
		JSON.stringify(prompt) === JSON.stringify(editedPrompt) ? false : true
	);

	let promptEditor: HTMLTextAreaElement | undefined = $state(undefined);
	let promptCopied = $state(false);
	let promptHovered = $state(false);
	let selectedSpan = $state<{ start: number; end: number } | undefined>(undefined);
	let promptSubmitted = $state(false);

	function copyPrompt() {
		navigator.clipboard.writeText(prompt.prompt);
		selectedSpan = undefined;
		promptCopied = true;
		setTimeout(() => {
			promptCopied = false;
		}, 3000);
	}

	function getSelection() {
		if (promptEditor?.selectionEnd ?? 0 - (promptEditor?.selectionStart ?? 0) > 10) {
			selectedSpan = {
				start: promptEditor?.selectionStart ?? 0,
				end: promptEditor?.selectionEnd ?? 0
			};
		} else {
			selectedSpan = undefined;
		}
	}

	afterNavigate(() => {
		promptSubmitted = false;
	});
</script>

<div
	class="relative flex min-h-24 cursor-text flex-col text-left {setPromptMaximized ? '' : 'grow'}"
	onmouseenter={() => (promptHovered = true)}
	onmouseleave={() => (promptHovered = false)}
	use:clickOutside={() => (selectedSpan = undefined)}
	role="button"
	tabindex="0"
>
	{#if selectedSpan}
		<RewriteBox bind:selectedSpan {prompt} {editPrompt} />
	{/if}
	<div
		class="relative min-h-24 {setPromptMaximized
			? ''
			: 'grow'} overflow-y-auto rounded border shadow"
	>
		<textarea
			class="relative h-full min-h-24 w-full border-none bg-white py-2 pl-2 pr-6 text-sm outline-none"
			bind:this={promptEditor}
			bind:value={editedPrompt.prompt}
			use:autosize
			onselect={getSelection}
			onmousedown={() => (selectedSpan = undefined)}
			onkeydown={(e) => {
				selectedSpan = undefined;
				suggestionApplied = -1;
				if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
					setPrompt();
				}
			}}
		/>
		{#if suggestionApplied > -1 || (!promptWasEdited && hoveredSuggestion && hoveredSuggestion.target_spans) || selectedSpan}
			<SuggestionOverlay
				{prompt}
				{hoveredSuggestion}
				{suggestionApplied}
				{editedPrompt}
				{selectedSpan}
			/>
		{/if}
	</div>
	<div class="absolute right-1 top-1 flex flex-col gap-1">
		<button
			onclick={copyPrompt}
			class="rounded bg-white p-1 transition-all {promptHovered
				? 'opacity-100'
				: 'opacity-30'} {promptCopied ? 'text-emerald-600' : ''}"
		>
			{#if promptCopied}
				<span class="flex items-center gap-2" in:fade>
					<Check class="h-5 w-5" />
				</span>
			{:else}
				<span class="group flex items-center gap-2 text-gray-500 hover:text-gray-900" in:fade>
					<Copy class="h-5 w-5" />
				</span>
			{/if}
		</button>
		{#if setPromptMaximized !== undefined}
			<button
				onclick={() => {
					if (setPromptMaximized) setPromptMaximized(true);
					selectedSpan = undefined;
				}}
				class="rounded bg-white p-1 transition-all {promptHovered ? 'opacity-100' : 'opacity-30'}"
			>
				<span class="group flex items-center gap-2 text-gray-500 hover:text-gray-900" in:fade>
					<Expand class="h-5 w-5" />
				</span>
			</button>
		{/if}
	</div>
</div>
<div class="ml-auto flex items-center gap-1 pt-3">
	{#if promptWasEdited && !promptSubmitted}
		<Button
			onclick={() => {
				editedPrompt = { ...prompt };
				suggestionApplied = -1;
			}}
			classNames="text-gray-500"
		>
			<Undo2 class="h-5 w-5" />
		</Button>
	{/if}
	<Button
		onclick={() => {
			promptSubmitted = true;
			setPrompt();
		}}
		disabled={!promptWasEdited || promptSubmitted}
		classNames=" w-fit text-blue-600"
		title="Save & Run"
		tooltipText="Save this as a new prompt."
	>
		<Save class="h-5 w-5 transition-all" />
	</Button>
</div>
