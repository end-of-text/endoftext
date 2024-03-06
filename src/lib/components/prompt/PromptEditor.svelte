<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import autosize from '$lib/autosize';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Tables } from '$lib/supabase';
	import { Check, Copy, Expand, Save, Undo2 } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import SuggestionOverlay from './SuggestionOverlay.svelte';

	let {
		editedPrompt,
		hoveredSuggestion,
		prompt,
		promptMaximized = false,
		setPrompt,
		suggestionApplied,
		selectedSpan,
		suggestions
	} = $props<{
		editedPrompt: Tables<'prompts'>;
		hoveredSuggestion: Tables<'suggestions'> | null;
		prompt: Tables<'prompts'>;
		promptMaximized: boolean;
		setPrompt: () => void;
		suggestionApplied: number;
		selectedSpan: { start: number; end: number } | undefined;
		suggestions: Promise<Tables<'suggestions'>[] | undefined>;
	}>();

	let promptWasEdited = $derived(
		JSON.stringify(prompt) === JSON.stringify(editedPrompt) ? false : true
	);

	let promptEditor: HTMLTextAreaElement | undefined = $state(undefined);
	let promptCopied = $state(false);
	let promptHovered = $state(false);
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
	class="relative flex min-h-24 grow cursor-text flex-col text-left"
	onmouseenter={() => (promptHovered = true)}
	onmouseleave={() => (promptHovered = false)}
	role="button"
	tabindex="0"
>
	<div class="relative min-h-24 grow overflow-y-auto rounded border shadow">
		<textarea
			class="relative h-full min-h-24 w-full border-none bg-white py-2 pl-2 pr-6 text-sm outline-none {selectedSpan
				? 'selection:bg-transparent'
				: ''}"
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
		<SuggestionOverlay
			{prompt}
			{hoveredSuggestion}
			{suggestionApplied}
			{editedPrompt}
			{promptWasEdited}
			bind:selectedSpan
			{suggestions}
		/>
	</div>
	<div class="absolute right-1 top-1 flex flex-col gap-1">
		<button
			onclick={copyPrompt}
			class="rounded bg-white p-1 {promptHovered
				? 'text-gray-active'
				: 'text-gray-inactive'} transition"
		>
			{#if promptCopied}
				<span class="flex items-center gap-2 text-emerald-600" in:fade>
					<Check class="h-5 w-5" />
				</span>
			{:else}
				<span class="group flex items-center gap-2 hover:text-gray-hovered" in:fade>
					<Copy class="h-5 w-5" />
				</span>
			{/if}
		</button>
		{#if !promptMaximized}
			<button
				onclick={() => {
					promptMaximized = true;
					selectedSpan = undefined;
				}}
				class="rounded bg-white p-1 transition-all {promptHovered
					? 'text-gray-active'
					: 'text-gray-inactive'}"
			>
				<span class="group flex items-center gap-2 hover:text-gray-hovered" in:fade>
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
				editedPrompt.prompt = prompt.prompt;
				editedPrompt.model = prompt.model;
				editedPrompt.responseFormat = prompt.responseFormat;
				editedPrompt.temperature = prompt.temperature;
				suggestionApplied = -1;
			}}
			classNames="text-gray-active"
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
