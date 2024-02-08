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
		class="mt-2 min-h-24 overflow-hidden rounded border bg-white bg-opacity-90 p-2 text-sm shadow"
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
	<div class="mt-2 flex items-center justify-between gap-2">
		<Button onclick={() => (showOptions = !showOptions)} classNames="hover:text-blue-500">
			<span class="text-black">Model Options</span>
			{#if showOptions}
				<ChevronUp />
			{:else}
				<ChevronDown />
			{/if}
		</Button>
		<div class="flex items-center gap-1">
			{#if promptWasEdited}
				<Button
					classNames="hover:text-blue-500"
					onclick={() => (editedPrompt = { ...prompt })}
					title=""
				>
					<Undo2 class="transition" />
				</Button>
				<Button
					onclick={() => setPrompt()}
					classNames="w-fit hover:text-green-500"
					title="Save & Run"
				>
					<Save class="transition" />
				</Button>
			{/if}
		</div>
	</div>
	{#if showOptions}
		<PromptOptions bind:prompt={editedPrompt} />
	{/if}
</div>
