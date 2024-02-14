<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { Tables } from '$lib/supabase';
	import { Check, Copy, Save, Undo2 } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let { prompt, editedPrompt, setPrompt } = $props<{
		prompt: Tables<'prompts'>;
		editedPrompt: Tables<'prompts'>;
		setPrompt: () => void;
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

<div class="flex max-h-[50%] min-h-0 shrink-0 flex-col">
	<div
		class="relative mt-2 min-h-0 cursor-text"
		onmouseenter={() => (promptHovered = true)}
		onmouseleave={() => (promptHovered = false)}
		role="button"
		tabindex="0"
	>
		<div
			contenteditable="plaintext-only"
			class="h-full min-h-24 overflow-y-auto rounded border bg-white bg-opacity-90 py-2 pl-2 pr-6 text-sm shadow"
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
	<div class="ml-auto mt-3 flex items-center gap-1">
		{#if promptWasEdited}
			<Button onclick={() => (editedPrompt = { ...prompt })} classNames="text-gray-500">
				<Undo2 class="h-5 w-5" />
			</Button>
		{/if}
		<Button
			onclick={() => setPrompt()}
			disabled={!promptWasEdited}
			classNames=" w-fit text-blue-500"
			title="Save & Run"
			tooltipText="Save this as a new prompt and run it for your example instances."
		>
			<Save class="h-5 w-5 transition-all" />
		</Button>
	</div>
</div>
