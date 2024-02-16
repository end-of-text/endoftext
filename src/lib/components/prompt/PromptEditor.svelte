<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { Tables } from '$lib/supabase';
	import { Check, Copy, Save, Undo2 } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import RewriteBox from './RewriteBox.svelte';
	import SuggestionOverlay from './SuggestionOverlay.svelte';

	let { prompt, hoveredSuggestion, suggestionApplied, editedPrompt, setPrompt, editPrompt } =
		$props<{
			prompt: Tables<'prompts'>;
			hoveredSuggestion: Tables<'suggestions'> | null;
			suggestionApplied: boolean;
			editedPrompt: Tables<'prompts'>;
			setPrompt: () => void;
			editPrompt: (suggestion: string) => void;
		}>();

	let promptWasEdited = $derived(
		JSON.stringify(prompt) === JSON.stringify(editedPrompt) ? false : true
	);

	let promptCopied = $state(false);
	let promptHovered = $state(false);
	let selectedText = $state<string | undefined>(undefined);

	function copyPrompt() {
		navigator.clipboard.writeText(prompt.prompt);
		promptCopied = true;
		setTimeout(() => {
			promptCopied = false;
		}, 3000);
	}

	function getSelectionHtml() {
		var selected = '';
		if (typeof window.getSelection != 'undefined') {
			var sel = window.getSelection();
			if (sel && sel.rangeCount) {
				var container = document.createElement('div');
				for (var i = 0, len = sel.rangeCount; i < len; ++i) {
					container.appendChild(sel.getRangeAt(i).cloneContents());
				}
				selected = container.innerHTML.replaceAll('<br>', '\n');
			}
		}

		if (selected.length > 10 && prompt.prompt.includes(selected)) {
			selectedText = selected;
		} else {
			selectedText = undefined;
		}
	}
</script>

<svelte:window onmouseup={getSelectionHtml} />

<div class="flex max-h-[50%] min-h-min flex-col pt-2">
	<div
		class="flex min-h-24 cursor-text flex-col"
		onmouseenter={() => (promptHovered = true)}
		onmouseleave={() => (promptHovered = false)}
		role="button"
		tabindex="0"
	>
		<div class="relative min-h-24">
			<div
				contenteditable="plaintext-only"
				class="relative h-full min-h-24 overflow-y-auto rounded border bg-white py-2 pl-2 pr-6 text-sm shadow"
				role="textbox"
				aria-multiline="true"
				tabindex="0"
				bind:innerText={editedPrompt.prompt}
				onkeydown={(e) => {
					suggestionApplied = false;
					if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
						setPrompt();
					}
				}}
			/>
			{#if suggestionApplied || (!promptWasEdited && hoveredSuggestion && hoveredSuggestion.target_spans)}
				<SuggestionOverlay {prompt} {hoveredSuggestion} {suggestionApplied} {editedPrompt} />
			{/if}
			{#if selectedText}
				<RewriteBox bind:selectedText {prompt} {editPrompt} />
			{/if}
			<button
				onclick={copyPrompt}
				class="absolute right-1 top-1 rounded bg-white p-1 transition-all {promptHovered
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
		</div>
	</div>
	<div class="ml-auto flex items-center gap-1 pt-3">
		{#if promptWasEdited}
			<Button onclick={() => (editedPrompt = { ...prompt })} classNames="text-gray-500">
				<Undo2 class="h-5 w-5" />
			</Button>
		{/if}
		<Button
			onclick={() => setPrompt()}
			disabled={!promptWasEdited}
			classNames=" w-fit text-blue-600"
			title="Save & Run"
			tooltipText="Save this as a new prompt and run it for your example instances."
		>
			<Save class="h-5 w-5 transition-all" />
		</Button>
	</div>
</div>
