<script lang="ts">
	import PromptOptions from '$lib/components/options/PromptOptions.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Tables } from '$lib/supabase';
	import { ChevronDown, ChevronUp, Save, Undo2 } from 'lucide-svelte';

	let { prompt, editedPrompt, showOptions, setPrompt } = $props<{
		prompt: Tables<'prompts'>;
		editedPrompt: Tables<'prompts'>;
		showOptions: boolean;
		setPrompt: () => void;
	}>();

	let promptWasEdited = $derived(
		JSON.stringify(prompt) === JSON.stringify(editedPrompt) ? false : true
	);
</script>

<div class="flex flex-col">
	<div
		contenteditable="plaintext-only"
		class="mt-2 min-h-24 rounded border bg-white bg-opacity-90 p-2 text-sm shadow"
		role="textbox"
		aria-multiline="true"
		tabindex="0"
		bind:innerText={editedPrompt.prompt}
		onkeydown={(e) => {
			if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
				setPrompt();
			}
		}}
	/>
	<div class="mt-3 flex items-center justify-between gap-2">
		<Button onclick={() => (showOptions = !showOptions)}>
			<span class="text-black">Model Options</span>
			{#if showOptions}
				<ChevronUp />
			{:else}
				<ChevronDown />
			{/if}
		</Button>
		<div class="flex items-center gap-1">
			{#if promptWasEdited}
				<Button onclick={() => (editedPrompt = { ...prompt })} classNames="text-gray-500">
					<Undo2 />
				</Button>
			{/if}
			<Button
				onclick={() => setPrompt()}
				disabled={!promptWasEdited}
				classNames="w-fit text-blue-500"
				title="Save & Run"
				tooltipText="Save this as a new prompt and run it for your example instances."
			>
				<Save class="transition" />
			</Button>
		</div>
	</div>
	{#if showOptions}
		<PromptOptions bind:prompt={editedPrompt} />
	{/if}
</div>
