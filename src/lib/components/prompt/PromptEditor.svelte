<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { Tables } from '$lib/supabase';
	import * as diff from 'diff';
	import { Check, Copy, Expand, Save, Undo2 } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let {
		prompt,
		hoveredSuggestion,
		suggestionApplied,
		editedPrompt,
		setPrompt,
		setPromptMaximized = undefined
	} = $props<{
		prompt: Tables<'prompts'>;
		hoveredSuggestion: Tables<'suggestions'> | null;
		suggestionApplied: boolean;
		editedPrompt: Tables<'prompts'>;
		setPrompt: () => void;
		setPromptMaximized?: (maximized: boolean) => void;
	}>();

	let promptWasEdited = $derived(
		JSON.stringify(prompt) === JSON.stringify(editedPrompt) ? false : true
	);

	let promptCopied = $state(false);
	let promptHovered = $state(false);

	function copyPrompt() {
		navigator.clipboard.writeText(prompt.prompt);
		promptCopied = true;
		setTimeout(() => {
			promptCopied = false;
		}, 3000);
	}
</script>

<div
	class="flex min-h-24 cursor-text flex-col text-left {setPromptMaximized ? '' : 'grow'}"
	onmouseenter={() => (promptHovered = true)}
	onmouseleave={() => (promptHovered = false)}
	role="button"
	tabindex="0"
>
	<div class="relative min-h-24 {setPromptMaximized ? '' : 'grow'}">
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
			<div
				class="user-select-none pointer-events-none absolute left-0 top-0 h-full min-h-24 w-full overflow-y-auto whitespace-pre-line rounded border py-2 pl-2 pr-6 text-sm text-transparent shadow"
				aria-hidden="true"
				transition:fade={{ duration: 200 }}
			>
				{#if suggestionApplied}
					{#each diff.diffWords(prompt.prompt, editedPrompt.prompt) as part}
						{#if part.added}
							<span class="bg-blue-600 opacity-30">{part.value}</span>
						{:else if !part.removed}
							{part.value}
						{/if}
					{/each}
				{:else if hoveredSuggestion && hoveredSuggestion.target_spans}
					{#each hoveredSuggestion.target_spans as span, index}
						{prompt.prompt.slice(
							index === 0 ? 0 : hoveredSuggestion.target_spans[index - 1][1],
							span[0]
						)}
						<span class="underline decoration-red-500 decoration-2">
							{prompt.prompt.slice(span[0], span[1])}
						</span>
						{#if index === hoveredSuggestion.target_spans.length - 1}
							<span>
								{prompt.prompt.slice(span[1])}
							</span>
						{/if}
					{/each}
				{/if}
			</div>
		{/if}
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
</div>
<div class="ml-auto flex items-center gap-1 pt-3">
	{#if promptWasEdited}
		<Button onclick={() => (editedPrompt = { ...prompt })} classNames="text-gray-500">
			<Undo2 class="h-5 w-5" />
		</Button>
	{/if}
	<Button
		onclick={setPrompt}
		disabled={!promptWasEdited}
		classNames=" w-fit text-blue-600"
		title="Save & Run"
		tooltipText="Save this as a new prompt."
	>
		<Save class="h-5 w-5 transition-all" />
	</Button>
</div>
